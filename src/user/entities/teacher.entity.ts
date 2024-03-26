import { Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { SchoolEntity } from '../../school/entities/school.entity';
import { BaseEntity } from '../../options/base-entity.options';

@Entity('teacher')
export class TeacherEntity extends BaseEntity {
  @OneToOne(() => UserEntity, (user) => user.teacher, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => SchoolEntity, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'school_id' })
  school: SchoolEntity;
}
