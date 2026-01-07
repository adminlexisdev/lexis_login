import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuarioModule } from '../usuario/usuario.module';
import { BrevoModule } from '../../services/brevo/brevo.module';
import { MfaModule } from '../mfa/mfa.module';
import { UserTokenInfoModule } from '../user_token_info/user_token_info.module';
import { JwtSharedModule } from '../../services/jwt/jwt.module';
import { UsuariosActivosModule } from '../usuarios-activos/usuarios-activos.module';
import { AnalyticsModule } from 'src/services/analytics/analytics.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    JwtSharedModule,
    UsuarioModule,
    UsuariosActivosModule,
    BrevoModule,
    MfaModule,
    UserTokenInfoModule,
    AnalyticsModule,
  ],
  exports: [],
})
export class AuthModule {}
