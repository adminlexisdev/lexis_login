import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { UsuariosActivosService } from '../usuarios-activos/usuarios-activos.service';
import { JwtTokenService } from '../../services/jwt-token.service';
import { JwtPayload } from '../../interfaces/jwt-payload.interface';
import { UsuariosActivos } from '../usuarios-activos/entities/usuarios-activos.entity';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosActivosService: UsuariosActivosService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly usuarioService: UsuarioService,
  ) {}

  async login(loginDto: LoginDto) {
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

    if (usuario.usuHasMfa) {
      //TODO: Implementar lógica de MFA
      return { message: 'MFA requerida' };
    }

    const payload: JwtPayload = {
      sub: usuario.usuEmail, // Usar email como identificador único
      email: usuario.usuEmail,
      proNombre: '',
      cueNombre: '',
    };

    const accessToken = this.jwtTokenService.sign(payload);

    return {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: '24h',
      user: {
        email: usuario.usuEmail,
      },
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
}
