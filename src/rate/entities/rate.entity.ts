import { BaseEntity } from '../../options/base-entity.options';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { RateAttributeEntity } from './rate-attribute.entity';
import { SubjectEntity } from '../../subject/entities/subject.entity';

@Entity('rate')
export class RateEntity extends BaseEntity {
  @Column()
  title: string;

  @Column()
  title_kg: string;

  @Column()
  description: string;

  @Column()
  description_kg: string;

  @ManyToMany(() => RateAttributeEntity, { eager: true })
  @JoinTable()
  attributes: RateAttributeEntity[];

  @Column({ type: 'varchar', length: 2200, default: '', select: false })
  content: string;

  @Column({ type: 'varchar', length: 2200, default: '', select: false })
  content_kg: string;

  @Column({ name: 'annual_price' })
  annualPrice: number;

  @Column({ name: 'monthly_price' })
  monthlyPrice: number;

  @Column({ type: 'int2', name: 'amount_of_public_tests' })
  amountOfPublicTests: number;

  @Column({ type: 'int2', name: 'amount_of_hidden_tests' })
  amountOfHiddenTests: number;

  @Column({ type: 'int2', name: 'amount_of_participants' })
  amountOfParticipants: number;

  @ManyToMany(() => SubjectEntity, { eager: true })
  @JoinTable()
  subjects: SubjectEntity[];

  @Column({ type: 'int2', name: 'amount_of_questions' })
  amountOfQuestions: number;

  @Column({ type: 'boolean', default: true, name: 'is_published' })
  isPublished: boolean;

  @Column({ type: 'boolean', default: false, name: 'is_freemium' })
  isFreemium: boolean;
}
