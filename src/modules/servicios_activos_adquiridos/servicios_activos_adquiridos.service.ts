import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ServiciosActivosAdquirido } from './entities/servicios_activos_adquirido.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ServiciosActivosAdquiridosService {
  constructor(
    @InjectRepository(ServiciosActivosAdquirido)
    private readonly serviciosActivosAdquiridosRepository: Repository<ServiciosActivosAdquirido>,
  ) {}

  async getServicioInfoByCuentaAndServicio(cueId: number, proNombre: string) {
    return await this.serviciosActivosAdquiridosRepository.findOne({
      where: { cueId, proNombre },
    });
  }
}
