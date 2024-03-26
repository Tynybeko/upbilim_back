import { UserRolesEnum } from '../enums/user-roles.enum';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../../options/base-entity.options';
import { TestingEntity } from '../../testing/entities/testing.entity';
import { StudentEntity } from './student.entity';
import { TeacherEntity } from './teacher.entity';
import { QuizEntity } from '../../quiz/entities/quiz.entity';
import { UserRateEntity } from '../../rate/entities/user-rate.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column({ nullable: true })
  avatar: string;

  @Column({ unique: true })
  username: string;

  @Column({ select: false })
  password: string;

  @Column({ unique: true, nullable: true })
  phone: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: UserRolesEnum,
    default: UserRolesEnum.USER,
  })
  role: UserRolesEnum;

  @OneToOne(() => StudentEntity, (student) => student.user, {
    onDelete: 'SET NULL',
    nullable: true,
    eager: true,
  })
  student: StudentEntity;

  @OneToOne(() => TeacherEntity, (teacher) => teacher.user, {
    onDelete: 'SET NULL',
    nullable: true,
    eager: true,
  })
  teacher: TeacherEntity;

  @OneToMany(() => QuizEntity, (quiz) => quiz.user)
  quizzers: QuizEntity[];

  @OneToMany(() => TestingEntity, (testing) => testing.owner)
  @JoinColumn({ name: 'completed_tests' })
  completedTests: TestingEntity[];

  @OneToOne(() => UserRateEntity, (userRate) => userRate.user, {
    nullable: true,
  })
  rate: UserRateEntity;
}
