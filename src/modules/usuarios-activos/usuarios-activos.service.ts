import { Injectable } from '@nestjs/common';
import { UsuariosActivos } from './entities/usuarios-activos.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiciosActivosAdquiridosService } from '../servicios_activos_adquiridos/servicios_activos_adquiridos.service';
import { GetUsuariosActivosInterface } from './interfaces/get-usuarios.interface';
import { ExternalJwtTokenService } from 'src/services/jwt/external-jwt-token.service';

@Injectable()
export class UsuariosActivosService {
  constructor(
    @InjectRepository(UsuariosActivos)
    private readonly usuariosActivosRepository: Repository<UsuariosActivos>,
    private readonly serviciosActivosAdquiridosService: ServiciosActivosAdquiridosService,
    private readonly externalJwtTokenService: ExternalJwtTokenService,
  ) {}

  findByProNombreAndEmail(proNombre: string, usuEmail: string) {
    return this.usuariosActivosRepository.findOne({
      where: { proNombre, usuEmail },
    });
  }

  findByEmail(usuEmail: string) {
    return this.usuariosActivosRepository.findOne({
      where: { usuEmail },
    });
  }

  getUserServices(usuEmail: string) {
    return this.usuariosActivosRepository
      .createQueryBuilder('ua')
      .select('ua.proNombre', 'service')
      .addSelect('ua.sadId', 'sadId')
      .where('ua.usuEmail = :usuEmail', { usuEmail })
      .getRawMany();
  }

  async getUsuariosByCuentaAndServicio(
    token: string,
  ): Promise<GetUsuariosActivosInterface> {
    const tokenResp = this.externalJwtTokenService.getPayloadFromToken(token);

    const cueId = tokenResp.cueId;
    const proNombre = 'LEXIS_TOTAL';

    const usuarios = await this.usuariosActivosRepository.find({
      where: { cueId, proNombre },
      select: ['usuId', 'usuNombre', 'usuApellido', 'usuEmail'],
      order: { usuApellido: 'ASC', usuNombre: 'ASC' },
    });

    const servicioInfo =
      await this.serviciosActivosAdquiridosService.getServicioInfoByCuentaAndServicio(
        cueId,
        proNombre,
      );

    return {
      usuarios,
      total: servicioInfo.paqAccesos,
      registrados: usuarios.length,
      sadId: servicioInfo.sadId,
    };
  }
}
