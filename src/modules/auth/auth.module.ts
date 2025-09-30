import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuariosActivosModule } from '../usuarios-activos/usuarios-activos.module';
import { JwtTokenService } from '../../services/jwt-token.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { UsuarioModule } from '../usuario/usuario.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtTokenService, JwtAuthGuard],
  imports: [
    UsuariosActivosModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret-key',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '24h' },
    }),
    UsuarioModule,
  ],
  exports: [JwtTokenService, JwtAuthGuard],
})
export class AuthModule {}
