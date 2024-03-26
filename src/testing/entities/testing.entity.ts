import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  RelationId,
} from 'typeorm';
import { BaseEntity } from '../../options/base-entity.options';
import { QuizEntity } from '../../quiz/entities/quiz.entity';
import { ParticipantEntity } from './participant.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { TestingStatusEnum } from '../enum/testing-status.enum';

@Entity('testing')
export class TestingEntity extends BaseEntity {
  @ManyToOne(() => QuizEntity, null, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quiz_id' })
  quiz: QuizEntity;

  @RelationId((testing: TestingEntity) => testing.quiz)
  quizId: number;

  @OneToMany(
    () => ParticipantEntity,
    (participant: ParticipantEntity) => participant.testing,
  )
  participants: ParticipantEntity[];

  @Column({ unique: true, length: 8 })
  code: string;

  @Column({
    type: 'enum',
    enum: TestingStatusEnum,
    default: TestingStatusEnum.CREATED,
  })
  status: TestingStatusEnum;

  @ManyToOne(() => UserEntity, null, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'owner_id' })
  owner: UserEntity;

  @Column({
    type: 'uuid',
    generated: 'uuid',
    name: 'access_key',
    select: false,
  })
  accessKey: string;
}
