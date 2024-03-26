import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from '../../options/base-entity.options';
import { UserEntity } from '../../user/entities/user.entity';
import { RateEntity } from './rate.entity';

@Entity('user_rate')
export class UserRateEntity extends BaseEntity {
  @OneToOne(() => UserEntity, (user) => user.rate, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => RateEntity, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'rate_id' })
  rate: RateEntity;

  @Column()
  price: number;

  @Column({ type: 'date' })
  validity: Date;
}
