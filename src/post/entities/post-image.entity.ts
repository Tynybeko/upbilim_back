import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../options/base-entity.options';

@Entity('post-image')
export class PostImageEntity extends BaseEntity {
  @Column()
  title: string;

  @Column()
  image: string;
}
