import { UserEntity } from '../../user/entities/user.entity';

export const userAdminOptions = {
  resource: UserEntity,
  options: {
    listProperties: ['id', 'firstName', 'lastName', 'email', 'phone'],
  },
};
