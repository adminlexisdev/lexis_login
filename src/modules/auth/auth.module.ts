import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuariosActivosModule } from '../usuarios-activos/usuarios-activos.module';
import { JwtTokenService } from '../../services/jwt/jwt-token.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { UsuarioModule } from '../usuario/usuario.module';
import { BrevoModule } from '../../services/brevo/brevo.module';
import { MfaModule } from '../mfa/mfa.module';
import { UserTokenInfoModule } from '../user_token_info/user_token_info.module';
import { ExternalJwtTokenService } from '../../services/jwt/external-jwt-token.service';
import { ExternalJwtAuthGuard } from '../../guards/external-jwt-auth.guard';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtTokenService,
    JwtAuthGuard,
    ExternalJwtTokenService,
    ExternalJwtAuthGuard,
  ],
  imports: [
    UsuariosActivosModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'Sign_Key_Ecommerce_Lexis_Lexdeal_2021',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '24h' },
    }),
    UsuarioModule,
    BrevoModule,
    MfaModule,
    UserTokenInfoModule,
  ],
  exports: [
    JwtTokenService,
    JwtAuthGuard,
    ExternalJwtTokenService,
    ExternalJwtAuthGuard,
  ],
})
export class AuthModule {}
