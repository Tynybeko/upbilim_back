import { BaseEntity } from '../../options/base-entity.options';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DistrictEntity } from '../../district/entities/district.entity';
import { CountryEntity } from '../../country/entities/country.entity';
import { RegionEntity } from 'src/region/entities/region.entity';

@Entity('school')
export class SchoolEntity extends BaseEntity {
  @Column({ unique: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 2200, nullable: true, select: false })
  content: string;

  @Column({ nullable: true })
  link: string;

  @ManyToOne(() => DistrictEntity, { eager: true })
  @JoinColumn({ name: 'district_id' })
  district: DistrictEntity;

  @ManyToOne(() => CountryEntity, { eager: true })
  @JoinColumn({ name: 'country_id' })
  country: CountryEntity;

  @ManyToOne(() => RegionEntity, { eager: true })
  @JoinColumn({ name: 'region_id' })
  region: RegionEntity;
}
