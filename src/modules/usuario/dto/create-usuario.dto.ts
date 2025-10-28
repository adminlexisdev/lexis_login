import { IsAlpha, IsEmail, IsNumberString, IsOptional } from 'class-validator';

export class CreateUsuarioDto {
  @IsAlpha()
  usuNombre: string;

  @IsAlpha()
  usuApellido: string;

  @IsEmail()
  usuEmail: string;

  @IsOptional()
  @IsNumberString()
  usuContacto: string;
}
