import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../interfaces/jwt-payload.interface';

@Injectable()
export class JwtTokenService {
  constructor(private readonly jwtService: JwtService) {}

  sign(payload: JwtPayload, duration: string): string {
    return this.jwtService.sign(payload, { expiresIn: duration });
  }

  verify(token: string): JwtPayload {
    return this.jwtService.verify<JwtPayload>(token);
  }

  /**
   * Extrae el payload completo del JWT. Acepta tanto el token puro como el formato "Bearer <token>".
   */
  getPayloadFromToken(tokenOrBearer: string): JwtPayload {
    const token = this.extractToken(tokenOrBearer);
    return this.verify(token);
  }

  /**
   * Obtiene la propiedad `data` del payload del JWT. Acepta token puro o con prefijo "Bearer ".
   */
  getDataFromToken(tokenOrBearer: string): JwtPayload['data'] {
    return this.getPayloadFromToken(tokenOrBearer).data;
  }

  /**
   * Si el valor viene como "Bearer <token>", devuelve solo <token>.
   * En caso contrario, devuelve el valor tal cual.
   */
  private extractToken(tokenOrBearer: string): string {
    const parts = tokenOrBearer?.split(' ');
    if (parts && parts.length === 2 && /^Bearer$/i.test(parts[0])) {
      return parts[1];
    }
    return tokenOrBearer;
  }
}
