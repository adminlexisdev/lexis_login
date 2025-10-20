import { IsString } from 'class-validator';

export class MfaRequestDto {
  @IsString()
  service: string;
}
