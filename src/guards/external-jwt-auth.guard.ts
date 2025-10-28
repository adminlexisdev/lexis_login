import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ExternalJwtTokenService } from '../services/jwt/external-jwt-token.service';

@Injectable()
export class ExternalJwtAuthGuard implements CanActivate {
  constructor(private readonly jwtTokenService: ExternalJwtTokenService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token de acceso requerido');
    }

    try {
      const payload = this.jwtTokenService.verify(token);
      (request as any).user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Token de acceso inválido o expirado');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
