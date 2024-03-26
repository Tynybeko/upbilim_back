import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SchoolEntity } from '../../school/entities/school.entity';
import { BaseStaticEntity } from '../../options/base-entity.options';

@Entity('group')
export class GroupEntity extends BaseStaticEntity {
  @Column({  })
  label: string;

  @Column({ })
  label_kg: string;

  @Column({  })
  label_uz: string;

  @Column({  })
  label_kz: string;

  @Column({  })
  label_en: string;


}
