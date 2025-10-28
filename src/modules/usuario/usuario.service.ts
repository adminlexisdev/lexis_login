import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LaasService } from 'src/services/laas/laas.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
    private readonly laasService: LaasService,
  ) {}

  async findUsuario(usuEmail: string) {
    return await this.usuariosRepository.findOne({ where: { usuEmail } });
  }

  async createUsuario(usuarioDto: CreateUsuarioDto) {
    try {
      const response = await this.laasService.addLitigantUser(usuarioDto, 1635);

      return response;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
