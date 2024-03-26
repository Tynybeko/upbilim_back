import { BaseEntity } from '../../options/base-entity.options';
import { Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { GroupEntity } from '../../group/entities/group.entity';

@Entity('student')
export class StudentEntity extends BaseEntity {
  @OneToOne(() => UserEntity, (user) => user.student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => GroupEntity, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'group_id' })
  group: GroupEntity;
}
