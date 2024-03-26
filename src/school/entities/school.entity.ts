import { BaseEntity } from '../../options/base-entity.options';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { DistrictEntity } from '../../district/entities/district.entity';
import { GroupEntity } from '../../group/entities/group.entity';

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

}
