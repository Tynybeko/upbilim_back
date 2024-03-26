import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseStaticEntity } from '../../options/base-entity.options';
import { CountryEntity } from 'src/country/entities/country.entity';

@Entity('region')
export class RegionEntity extends BaseStaticEntity {
  @Column({ unique: true })
  label: string;

  @Column({ unique: true })
  label_kg: string;

  @Column({ unique: true })
  label_kz: string;

  @Column({ unique: true })
  label_uz: string;

  @Column({ unique: true })
  label_en: string;
  
  @ManyToOne(() => CountryEntity)
  @JoinColumn({ name: 'country_id' })
  country: CountryEntity;
}
