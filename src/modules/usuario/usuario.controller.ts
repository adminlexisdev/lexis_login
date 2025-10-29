import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { ExternalJwtAuthGuard } from 'src/guards/external-jwt-auth.guard';
import { Request } from 'express';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post('/save_litigant_user')
  @UseGuards(ExternalJwtAuthGuard)
  async create(
    @Req() req: Request,
    @Body() createUsuarioDto: CreateUsuarioDto,
  ) {
    const token = req.headers.authorization || '';
    return await this.usuarioService.createUsuario(createUsuarioDto, token);
  }
}
