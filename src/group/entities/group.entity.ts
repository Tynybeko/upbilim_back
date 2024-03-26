import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SchoolEntity } from '../../school/entities/school.entity';
import { BaseStaticEntity } from '../../options/base-entity.options';

@Entity('group')
export class GroupEntity extends BaseStaticEntity {
  @Column({ unique: true })
  label: string;

  @Column({ unique: true })
  label_kg: string;

  @Column({ unique: true })
  label_uz: string;

  @Column({ unique: true })
  label_kz: string;

  @Column({ unique: true })
  label_en: string;


}
