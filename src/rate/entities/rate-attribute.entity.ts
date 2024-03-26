import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../options/base-entity.options';

@Entity('rate_attribute')
export class RateAttributeEntity extends BaseEntity {
  @Column({ unique: true })
  title: string;

  @Column({ unique: true, nullable: true })
  title_kg: string;
}
