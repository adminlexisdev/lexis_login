import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtExternalPayload } from 'src/interfaces/jwt-external.payload.interface';

@Injectable()
export class ExternalJwtTokenService {
  private readonly secret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.secret = this.configService.get<string>('JWT_EXTERNAL_SECRET');
  }

  verify(token: string): JwtExternalPayload {
    return this.jwtService.verify<JwtExternalPayload>(token, {
      secret: this.secret,
    });
  }

  getPayloadFromToken(tokenOrBearer: string): JwtExternalPayload {
    const token = this.extractToken(tokenOrBearer);
    return this.verify(token);
  }

  getDataFromToken(tokenOrBearer: string): JwtExternalPayload {
    return this.getPayloadFromToken(tokenOrBearer);
  }

  private extractToken(tokenOrBearer: string): string {
    const parts = tokenOrBearer?.split(' ');
    if (parts && parts.length === 2 && /^Bearer$/i.test(parts[0])) {
      return parts[1];
    }
    return tokenOrBearer;
  }
}
