import { BaseEntity } from '../../options/base-entity.options';
import { Column, Entity, ManyToMany } from 'typeorm';
import { QuizEntity } from '../../quiz/entities/quiz.entity';

@Entity('klass')
export class KlassEntity extends BaseEntity {
  @Column({ unique: true })
  title: string;

  @Column({ unique: true, nullable: true })
  title_kg: string;

}
