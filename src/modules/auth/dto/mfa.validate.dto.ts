import { IsString, Length } from 'class-validator';

export class MfaValidateDto {
  @IsString()
  service: string;

  @IsString()
  @Length(6, 6)
  code: string;
}
