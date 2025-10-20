import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Mfa {
  @PrimaryGeneratedColumn({ name: 'mfa_id' })
  mfa_id: number;

  @Column({ name: 'usu_id' })
  usuId: number;

  @Column({ name: 'mfa_service' })
  mfaService: string;

  @Column({ name: 'mfa_code' })
  mfaCode: string;

  @Column({ name: 'mfa_is_used', default: false })
  mfaIsUsed: boolean;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
