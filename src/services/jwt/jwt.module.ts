import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtTokenService } from './jwt-token.service';
import { ExternalJwtTokenService } from './external-jwt-token.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { ExternalJwtAuthGuard } from '../../guards/external-jwt-auth.guard';

@Global()
@Module({
  imports: [
    ConfigModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'Sign_Key_Ecommerce_Lexis_Lexdeal_2021',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '24h' },
    }),
  ],
  providers: [
    JwtTokenService,
    ExternalJwtTokenService,
    JwtAuthGuard,
    ExternalJwtAuthGuard,
  ],
  exports: [
    JwtModule,
    JwtTokenService,
    ExternalJwtTokenService,
    JwtAuthGuard,
    ExternalJwtAuthGuard,
  ],
})
export class JwtSharedModule {}
