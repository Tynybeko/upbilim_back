import { BaseStaticEntity } from '../../options/base-entity.options';
import { Column, Entity, ManyToMany, ManyToOne, JoinColumn } from 'typeorm';
import { QuizEntity } from '../../quiz/entities/quiz.entity';
import { GroupEntity } from 'src/group/entities/group.entity';

@Entity('subject')
export class SubjectEntity extends BaseStaticEntity {
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

  @ManyToMany(() => QuizEntity, (quiz) => quiz.subjects)
  quizzers: QuizEntity[];

  @ManyToOne(() => GroupEntity)
  @JoinColumn({ name: 'group_id' })
  group: GroupEntity;
}
