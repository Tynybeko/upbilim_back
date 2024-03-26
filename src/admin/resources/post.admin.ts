import { PostEntity } from '../../post/entities/post.entity';

export const postAdminOptions = {
  resource: PostEntity,
  options: {
    listProperties: ['id', 'title', 'description', 'createdAt'],
  },
};
