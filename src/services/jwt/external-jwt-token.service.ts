import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../../interfaces/jwt-payload.interface';

@Injectable()
export class ExternalJwtTokenService {
  private readonly secret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.secret = this.configService.get<string>('JWT_EXTERNAL_SECRET');
  }

  verify(token: string): JwtPayload {
    return this.jwtService.verify<JwtPayload>(token, { secret: this.secret });
  }

  getPayloadFromToken(tokenOrBearer: string): JwtPayload {
    const token = this.extractToken(tokenOrBearer);
    return this.verify(token);
  }

  getDataFromToken(tokenOrBearer: string): JwtPayload['data'] {
    return this.getPayloadFromToken(tokenOrBearer).data;
  }

  private extractToken(tokenOrBearer: string): string {
    const parts = tokenOrBearer?.split(' ');
    if (parts && parts.length === 2 && /^Bearer$/i.test(parts[0])) {
      return parts[1];
    }
    return tokenOrBearer;
  }
}
