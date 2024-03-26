import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  RelationId,
} from 'typeorm';
import { BaseEntity } from '../../options/base-entity.options';
import { UserEntity } from '../../user/entities/user.entity';
import { TestingEntity } from './testing.entity';
import { SelectedAnswerEntity } from './selected-answer.entity';

@Entity('participant')
export class ParticipantEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.completedTests, {
    nullable: true,
    onDelete: 'SET NULL',
    eager: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column()
  name: string;

  @ManyToOne(() => TestingEntity, (testing) => testing.participants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'testing_id' })
  testing: TestingEntity;

  @RelationId((participant: ParticipantEntity) => participant.testing)
  testingId: number;

  @OneToMany(
    () => SelectedAnswerEntity,
    (selectedAnswer) => selectedAnswer.participant,
  )
  selectedAnswers: SelectedAnswerEntity[];

  @Column({ name: 'total_point', default: 0 })
  totalPoint: number;

  @Column({
    type: 'uuid',
    generated: 'uuid',
    name: 'access_key',
    select: false,
  })
  accessKey: string;
}
