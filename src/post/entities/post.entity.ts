import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../options/base-entity.options';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('post')
export class PostEntity extends BaseEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column({ type: 'varchar', length: 2200 })
  content: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;
}
