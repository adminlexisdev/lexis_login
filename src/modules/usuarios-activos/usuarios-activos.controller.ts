import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsuariosActivosService } from './usuarios-activos.service';
import { ExternalJwtAuthGuard } from '../../guards/external-jwt-auth.guard';
import { Request } from 'express';
@Controller('usuarios-activos')
export class UsuariosActivosController {
  constructor(
    private readonly usuariosActivosService: UsuariosActivosService,
  ) {}

  @UseGuards(ExternalJwtAuthGuard)
  @Get('get_service')
  getUsersFromService(@Req() req: Request) {
    const token = req.headers.authorization || '';
    return this.usuariosActivosService.getUsuariosByCuentaAndServicio(token);
  }
}
