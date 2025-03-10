import { BaseStaticEntity } from '../../options/base-entity.options';
import { Column, Entity, ManyToMany, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { QuizEntity } from '../../quiz/entities/quiz.entity';
import { GroupEntity } from 'src/group/entities/group.entity';

@Entity('subject')
export class SubjectEntity extends BaseStaticEntity {
  @Column({})
  label: string;

  @Column({})
  label_kg: string;

  @Column({})
  label_uz: string;

  @Column({})
  label_kz: string;

  @Column({})
  label_en: string;

  @OneToMany(() => QuizEntity, (quiz) => quiz.subject)
  quizzers: QuizEntity[];

  @ManyToOne(() => GroupEntity)
  @JoinColumn({ name: 'group_id' })
  group: GroupEntity;
}
