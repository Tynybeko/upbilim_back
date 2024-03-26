import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseStaticEntity } from '../../options/base-entity.options';
import { RegionEntity } from '../../region/entities/region.entity';
import { CountryEntity } from 'src/country/entities/country.entity';

@Entity('district')
export class DistrictEntity extends BaseStaticEntity {
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

  @ManyToOne(() => RegionEntity)
  @JoinColumn({ name: 'region_id' })
  region: RegionEntity;


  @ManyToOne(() => CountryEntity)
  @JoinColumn({ name: 'country_id' })
  country: CountryEntity;
}
