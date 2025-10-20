import { Module } from '@nestjs/common';
import { UserTokenInfoService } from './user_token_info.service';
import { UserTokenInfoController } from './user_token_info.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTokenInfo } from './entities/user_token_info.entity';

@Module({
  controllers: [UserTokenInfoController],
  providers: [UserTokenInfoService],
  imports: [TypeOrmModule.forFeature([UserTokenInfo])],
  exports: [UserTokenInfoService],
})
export class UserTokenInfoModule {}
