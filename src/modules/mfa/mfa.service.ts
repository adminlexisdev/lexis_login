import { Injectable } from '@nestjs/common';
import { CreateMfaDto } from './dto/create-mfa.dto';
import { Repository } from 'typeorm';
import { Mfa } from './entities/mfa.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MfaService {
  constructor(
    @InjectRepository(Mfa)
    private readonly mfaRepository: Repository<Mfa>,
  ) {}

  create(createMfaDto: CreateMfaDto) {
    const mfa = this.mfaRepository.create({
      mfaCode: createMfaDto.mfaCode,
      usuId: createMfaDto.userId,
      mfaService: createMfaDto.mfaService,
    });
    return this.mfaRepository.save(mfa);
  }

  desactiveMfaCode(usuId: number, mfaService: string) {
    return this.mfaRepository.update(
      { usuId, mfaService },
      { mfaIsUsed: true },
    );
  }

  findActiveMfaCode(usuId: number, mfaService: string) {
    return this.mfaRepository.findOne({
      where: { usuId, mfaService, mfaIsUsed: false },
      order: { createdAt: 'DESC' },
    });
  }
}
