import { Column, Entity, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { BaseEntity } from '../../options/base-entity.options';
import { ParticipantEntity } from './participant.entity';
import { AnswerEntity } from '../../quiz/entities/answer.entity';
import { QuestionEntity } from '../../quiz/entities/question.entity';

@Entity('selected_answer')
export class SelectedAnswerEntity extends BaseEntity {
  @ManyToOne(
    () => ParticipantEntity,
    (participant) => participant.selectedAnswers,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'participant_id' })
  participant: ParticipantEntity;

  @ManyToOne(() => QuestionEntity, null, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'question_id' })
  question: QuestionEntity;

  @ManyToOne(() => AnswerEntity, null, { onDelete: 'SET NULL', eager: true })
  @JoinColumn({ name: 'answer_id' })
  answer: AnswerEntity;

  @RelationId((selectedAnswer: SelectedAnswerEntity) => selectedAnswer.question)
  questionId: number;

  @RelationId(
    (selectedAnswer: SelectedAnswerEntity) => selectedAnswer.participant,
  )
  participantId: ParticipantEntity;

  @Column({ type: 'int', default: 0 })
  point: number;
}
