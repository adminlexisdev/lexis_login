import { Injectable } from '@nestjs/common';
import { UsuariosActivos } from './entities/usuarios-activos.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsuariosActivosService {
  constructor(
    @InjectRepository(UsuariosActivos)
    private readonly usuariosActivosRepository: Repository<UsuariosActivos>,
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
      .where('ua.usuEmail = :usuEmail', { usuEmail })
      .getRawMany();
  }
}
