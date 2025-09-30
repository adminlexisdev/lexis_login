import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Request } from 'express';
import { JwtPayload } from '../../interfaces/jwt-payload.interface';

// Extender el tipo Request para incluir user
interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req: AuthenticatedRequest) {
    return {
      message: 'Perfil de usuario autenticado',
      user: req.user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  refreshToken(@Req() req: AuthenticatedRequest) {
    // Aquí podrías implementar lógica para refrescar el token
    return {
      message: 'Token válido',
      user: req.user,
    };
  }
}
