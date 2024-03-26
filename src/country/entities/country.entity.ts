import { Column, Entity, } from 'typeorm';
import { BaseStaticEntity } from '../../options/base-entity.options';

@Entity('country')
export class CountryEntity extends BaseStaticEntity {
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
