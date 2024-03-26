import { BaseEntity } from '../../options/base-entity.options';
import { QuestionEntity } from './question.entity';
import { Column, Entity, JoinColumn, ManyToOne, RelationId } from 'typeorm';

@Entity('answer')
export class AnswerEntity extends BaseEntity {
  @ManyToOne(() => QuestionEntity, (question) => question.answers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'question_id' })
  question: QuestionEntity;

  @RelationId((answer: AnswerEntity) => answer.question)
  questionId: number;

  @Column({ type: 'varchar', length: '250', nullable: true })
  value: string;

  @Column({ nullable: true })
  image: string;

  @Column({ type: 'boolean', default: false, name: 'is_correct' })
  isCorrect: boolean;
}
