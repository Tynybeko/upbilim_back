import { BaseEntity } from '../../options/base-entity.options';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { RateEntity } from './rate.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { RateAppStatusEnum } from '../enums/rate-app-status.enum';

@Entity('rate-application')
export class RateApplicationEntity extends BaseEntity {
  @ManyToOne(() => RateEntity, {
    eager: true,
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'rate_id' })
  rate: RateEntity;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ default: false })
  isAnnual: boolean;

  @Column({ type: 'int', default: 1 })
  duration: number;

  @Column()
  phone: string;

  @Column({
    type: 'enum',
    enum: RateAppStatusEnum,
    default: RateAppStatusEnum.PENDING,
  })
  status: RateAppStatusEnum;
}
