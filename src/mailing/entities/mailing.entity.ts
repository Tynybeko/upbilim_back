import { BaseEntity } from '../../options/base-entity.options';
import { Column, Entity } from 'typeorm';

@Entity('mailing')
export class MailingEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;
}
