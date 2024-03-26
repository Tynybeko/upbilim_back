import { BaseEntity } from '../../options/base-entity.options';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  RelationId,
} from 'typeorm';
import { SubjectEntity } from '../../subject/entities/subject.entity';
import { KlassEntity } from '../../klass/entities/klass.entity';
import { QuestionEntity } from './question.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { GroupEntity } from 'src/group/entities/group.entity';
import { LangEntity } from '../../langs/entities/langs.entity'

@Entity('quiz')
export class QuizEntity extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: 'varchar', length: '250', nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  icon: string;

  @ManyToMany(() => SubjectEntity, (subject) => subject.quizzers, {
    eager: true,
  })
  @JoinTable()
  subjects: SubjectEntity[];

  @OneToMany(() => QuestionEntity, (question) => question.quiz)
  questions: QuestionEntity[];

  @RelationId((quiz: QuizEntity) => quiz.questions)
  questionIds: number[];

  @ManyToOne(() => UserEntity, (user) => user.quizzers, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => GroupEntity)
  @JoinColumn({ name: 'group_id' })
  group: GroupEntity;


  @ManyToOne(() => LangEntity)
  @JoinColumn({ name: 'lang_id' })
  lang: LangEntity;


  @Column({ type: 'boolean', default: true, name: 'is_published' })
  isPublished: boolean;

  @Column({ type: 'boolean', default: false, name: 'is_frozen' })
  isFrozen: boolean;
}
