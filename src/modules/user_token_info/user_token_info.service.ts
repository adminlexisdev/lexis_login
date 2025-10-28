import { Injectable } from '@nestjs/common';
import { UserTokenInfo } from './entities/user_token_info.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class UserTokenInfoService {
  constructor(
    @InjectRepository(UserTokenInfo)
    private readonly userTokenInfoRepository: Repository<UserTokenInfo>,
  ) {}

  async getUserTokenInfo(usuId: number): Promise<UserTokenInfo | null> {
    return this.userTokenInfoRepository.findOne({ where: { usuId } });
  }

  async getUsersAccountByUserId(usuId: number): Promise<UserTokenInfo[]> {
    return this.userTokenInfoRepository.find({ where: { usuId } });
  }
}
