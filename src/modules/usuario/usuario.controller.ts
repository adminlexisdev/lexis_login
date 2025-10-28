import { Body, Controller, Post } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post('/save_litigant_user')
  async create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return await this.usuarioService.createUsuario(createUsuarioDto);
  }
}
