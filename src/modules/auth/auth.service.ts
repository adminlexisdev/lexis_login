import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { UsuariosActivosService } from '../usuarios-activos/usuarios-activos.service';
import { JwtTokenService } from '../../services/jwt/jwt-token.service';
import { JwtPayload } from '../../interfaces/jwt-payload.interface';
import { UsuarioService } from '../usuario/usuario.service';
import { v4 as uuidv4 } from 'uuid';
import { LoginResponse } from './interfaces/login.response.interface';
import { BrevoService } from '../../services/brevo/brevo.service';
import { MfaRequestDto } from './dto/mfa.request.dto';
import { MfaService } from '../mfa/mfa.service';
import { MfaValidateDto } from './dto/mfa.validate.dto';
import { UserTokenInfoService } from '../user_token_info/user_token_info.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosActivosService: UsuariosActivosService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly usuarioService: UsuarioService,
    private readonly brevoService: BrevoService,
    private readonly mfaService: MfaService,
    private readonly userTokenInfoService: UserTokenInfoService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const usuario = await this.usuarioService.findUsuario(loginDto.email);

    if (!usuario) {
      throw new UnauthorizedException('El usuario no existe');
    }

    if (
      usuario.usuCuentaBloqueada ||
      !usuario.usuHabilitado ||
      !usuario.usuStatusRegister
    ) {
      throw new UnauthorizedException(
        'El usuario está bloqueado o no se encuentra habilitado',
      );
    }

    const isPasswordValid = await this.validatePassword(
      loginDto.password,
      usuario.usuPassword,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const userTokenInfo = await this.userTokenInfoService.getUserTokenInfo(
      usuario.usuId,
    );

    const payload: JwtPayload = {
      user_name: usuario.usuEmail,
      client_id: 'LEXIS_PP',
      jti: uuidv4(),
      authorities: userTokenInfo.authorities.split(','),
      scope: ['read'],
      data: {
        cueId: userTokenInfo.cueId,
        cuenta: userTokenInfo.cuenta,
        usuId: usuario.usuId,
        usuNombre: usuario.usuNombre,
        usuApellido: usuario.usuApellido,
        usuEmail: usuario.usuEmail,
        services: userTokenInfo.services.split(','),
        authorities: userTokenInfo.authorities.split(','),
        service: 'LEXIS_PP',
        usuLitigant: userTokenInfo.usuLitigant,
        usuLitigantServices: userTokenInfo.usuLitigantServices,
        usuLitigantEstado: userTokenInfo.usuLitigantEstado,
        usuLitigantRole: userTokenInfo.usuLitigantRole,
        usuCredendialExpirada: userTokenInfo.usuCredendialExpirada,
        hasServices: userTokenInfo.hasServices,
        sector: userTokenInfo.sector,
        usuHasMfa: usuario.usuHasMfa,
      },
    };

    const accessToken = this.jwtTokenService.sign(
      payload,
      usuario.usuHasMfa ? '10m' : '1h',
    );

    const refreshToken = 'todotoken';
    return {
      access_token: accessToken,
      token_type: 'bearer',
      refresh_token: usuario.usuHasMfa ? undefined : refreshToken,
      expires_in: usuario.usuHasMfa ? '10m' : '1h',
      scope: ['read'],
      data: payload.data,
      jti: payload.jti,
    };
  }

  private async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error('Error al validar contraseña:', error);
      return false;
    }
  }

  async requestMfaCode(tokenOrBearer: string, mfaRequestDto: MfaRequestDto) {
    try {
      const data = this.jwtTokenService.getDataFromToken(tokenOrBearer);

      if (data.usuHasMfa === false) {
        throw new UnauthorizedException('El usuario no tiene MFA habilitado');
      }
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const services = await this.usuariosActivosService.getUserServices(
        data.usuEmail,
      );
      const userServices = services.map((s) => s.service);

      if (!userServices.includes(mfaRequestDto.service)) {
        throw new UnauthorizedException(
          'El servicio solicitado no está permitido para el usuario',
        );
      }

      await this.mfaService.desactiveMfaCode(data.usuId, mfaRequestDto.service);

      await this.mfaService.create({
        userId: data.usuId,
        mfaCode: bcrypt.hashSync(code, 10),
        mfaService: mfaRequestDto.service,
      });

      const params = {
        code,
      };
      this.brevoService.sendMail(data.usuEmail, 926, params);

      return { message: 'El email ha sido enviado correctamente' };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async validateMfaCode(
    tokenOrBearer: string,
    mfaValidateDto: MfaValidateDto,
  ): Promise<LoginResponse> {
    try {
      const data = this.jwtTokenService.getDataFromToken(tokenOrBearer);
      data.service = mfaValidateDto.service;

      const services = await this.usuariosActivosService.getUserServices(
        data.usuEmail,
      );

      data.sadId = +services.find((s) => s.service === mfaValidateDto.service)
        ?.sadId;

      const userServices = services.map((s) => s.service);

      if (!userServices.includes(mfaValidateDto.service)) {
        throw new UnauthorizedException(
          'El servicio solicitado no está permitido para el usuario',
        );
      }

      const mfaRecord = await this.mfaService.findActiveMfaCode(
        data.usuId,
        mfaValidateDto.service,
      );

      if (!mfaRecord) {
        throw new UnauthorizedException('Código MFA inválido o ya usado.');
      }

      //5m = 5 * 60000 ms
      if (mfaRecord.createdAt.getTime() + 5 * 60000 < Date.now()) {
        await this.mfaService.desactiveMfaCode(
          data.usuId,
          mfaValidateDto.service,
        );
        throw new UnauthorizedException('Código MFA inválido o ya usado');
      }

      const isCodeValid = await bcrypt.compare(
        mfaValidateDto.code,
        mfaRecord.mfaCode,
      );

      if (!isCodeValid) {
        throw new UnauthorizedException('Código MFA inválido');
      }

      await this.mfaService.desactiveMfaCode(
        data.usuId,
        mfaValidateDto.service,
      );

      const newPayload: JwtPayload = {
        jti: uuidv4(),
        client_id: mfaValidateDto.service,
        scope: ['read'],
        authorities: data.authorities,
        data: { ...data },
        user_name: data.usuEmail,
      };
      const accessToken = this.jwtTokenService.sign(newPayload, '1h');

      return {
        access_token: accessToken,
        token_type: 'bearer',
        refresh_token: '<refresh_token>',
        expires_in: '1h',
        scope: ['read'],
        data: data,
        jti: newPayload.jti,
      };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
