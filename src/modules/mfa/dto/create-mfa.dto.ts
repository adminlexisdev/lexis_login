import { IsInt, IsString, Length } from 'class-validator';

export class CreateMfaDto {
  @IsString()
  @Length(6, 6)
  mfaCode: string;

  @IsString()
  mfaService: string;

  @IsInt()
  userId: number;
}
