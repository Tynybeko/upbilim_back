import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { UserRolesEnum } from '../user/enums/user-roles.enum';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class AdminService {
  constructor(private dataSource: DataSource) {}

  async authenticate(username: string, password: string) {
    const repository = this.dataSource.getRepository<UserEntity>('user');
    const user = await repository.findOne({
      where: { username },
      select: [
        'username',
        'password',
        'id',
        'role',
        'avatar',
        'phone',
        'email',
        'firstName',
        'lastName',
      ],
    });
    if (!user) return null;
    const passwordEquals = await bcryptjs.compare(password, user.password);
    if (user && passwordEquals && user.role === UserRolesEnum.ADMIN) {
      return { username: user.username, email: user.email };
    }
    return null;
  }
}
