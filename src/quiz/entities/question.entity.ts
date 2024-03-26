import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  RelationId,
} from 'typeorm';
import { BaseEntity } from '../../options/base-entity.options';
import { QuizEntity } from './quiz.entity';
import { AnswerEntity } from './answer.entity';

@Entity('question')
export class QuestionEntity extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: 'varchar', length: '250', nullable: true })
  content: string;

  @Column({ nullable: true })
  image: string;

  @Column({ type: 'int4', default: 30 })
  time: number;

  @Column({ type: 'int4', default: 1 })
  point: number;

  @ManyToOne(() => QuizEntity, (quiz) => quiz.questions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'quiz_id' })
  quiz: QuizEntity;

  @RelationId((question: QuestionEntity) => question.quiz)
  quizId: number;

  @OneToMany(() => AnswerEntity, (answer) => answer.question)
  answers: AnswerEntity[];

  @Column({ type: 'int' })
  order: number;
}
