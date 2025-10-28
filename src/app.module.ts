import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getTypeOrmConfig } from './config/database/mysql.config';
import { UsuariosActivosModule } from './modules/usuarios-activos/usuarios-activos.module';
import { AuthModule } from './modules/auth/auth.module';
import { BrevoModule } from './services/brevo/brevo.module';
import { MfaModule } from './modules/mfa/mfa.module';
import { UserTokenInfoModule } from './modules/user_token_info/user_token_info.module';
import { EurekaModule } from './config/eureka/eureka.module';
import { ServiciosActivosAdquiridosModule } from './modules/servicios_activos_adquiridos/servicios_activos_adquiridos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,
    }),
    UsuarioModule,
    UsuariosActivosModule,
    AuthModule,
    BrevoModule,
    MfaModule,
    UserTokenInfoModule,
    EurekaModule,
    ServiciosActivosAdquiridosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
