import { IsNumber } from 'class-validator';

export class DeleteUsuarioDto {
  @IsNumber()
  invId: number;
}
