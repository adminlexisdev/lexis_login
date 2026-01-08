import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Request } from 'express';
import { JwtPayload } from '../../interfaces/jwt-payload.interface';
import { MfaRequestDto } from './dto/mfa.request.dto';
import { MfaValidateDto } from './dto/mfa.validate.dto';

interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  refreshToken(@Req() req: AuthenticatedRequest) {
    // Aquí podrías implementar lógica para refrescar el token
    return {
      message: 'Token válido',
      user: req.user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('mfa/request')
  @HttpCode(HttpStatus.OK)
  requestMfaCode(
    @Req() httpReq: AuthenticatedRequest,
    @Body() body: MfaRequestDto,
  ) {
    const authorization = httpReq.headers.authorization || '';
    return this.authService.requestMfaCode(authorization, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('mfa/validate')
  @HttpCode(HttpStatus.OK)
  validateMfaCode(
    @Req() httpReq: AuthenticatedRequest,
    @Body() body: MfaValidateDto,
  ) {
    const authorization = httpReq.headers.authorization || '';
    const clientIp = this.getClientIp(httpReq);
    return this.authService.validateMfaCode(authorization, body, clientIp);
  }

  private getClientIp(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'];

    if (Array.isArray(forwarded) && forwarded.length > 0) {
      return forwarded[0];
    }

    if (typeof forwarded === 'string' && forwarded.length > 0) {
      return forwarded.split(',')[0].trim();
    }

    return req.socket?.remoteAddress || req.ip || '';
  }
}
