import { IsAlpha, IsEmail, IsNumberString, IsOptional } from 'class-validator';

export class CreateUsuarioDto {
  @IsAlpha('es-ES')
  usuNombre: string;

  @IsAlpha('es-ES')
  usuApellido: string;

  @IsEmail()
  usuEmail: string;

  @IsOptional()
  @IsNumberString()
  usuContacto: string;
}
