import { Column, Entity, } from 'typeorm';
import { BaseStaticEntity } from '../../options/base-entity.options';

@Entity('lang')
export class LangEntity extends BaseStaticEntity {
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


  @Column({ unique: true })
  code: string;
}
