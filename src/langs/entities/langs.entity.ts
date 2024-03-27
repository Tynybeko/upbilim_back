import { Column, Entity, } from 'typeorm';
import { BaseStaticEntity } from '../../options/base-entity.options';

@Entity('lang')
export class LangEntity extends BaseStaticEntity {
  @Column({ })
  label: string;

  @Column({  })
  label_kg: string;

  @Column({ })
  label_uz: string;

  @Column({ })
  label_kz: string;

  @Column({ })
  label_en: string;

  @Column({ unique: true })
  code: string;
}
