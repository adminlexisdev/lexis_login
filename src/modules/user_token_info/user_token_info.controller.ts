import { Controller } from '@nestjs/common';
import { UserTokenInfoService } from './user_token_info.service';

@Controller('user-token-info')
export class UserTokenInfoController {
  constructor(private readonly userTokenInfoService: UserTokenInfoService) {}
}
