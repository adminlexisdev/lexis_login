import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LaasService } from 'src/services/laas/laas.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { ExternalJwtTokenService } from 'src/services/jwt/external-jwt-token.service';
import { console } from 'node:inspector/promises';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
    private readonly laasService: LaasService,
    private readonly externalJwtTokenService: ExternalJwtTokenService,
  ) {}

  async findUsuario(usuEmail: string) {
    return await this.usuariosRepository.findOne({ where: { usuEmail } });
  }

  async createUsuario(usuarioDto: CreateUsuarioDto, token: string) {
    try {
      const tokenResp = this.externalJwtTokenService.getPayloadFromToken(token);
      console.log('Token Response:', tokenResp);
      const response = await this.laasService.addLitigantUser(
        usuarioDto,
        tokenResp.sadId,
      );

      return response;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
