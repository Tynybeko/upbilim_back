import { Module } from '@nestjs/common';
import { AdminModule as MainAdminModule } from '@adminjs/nestjs';
import { UserEntity } from '../user/entities/user.entity';
import AdminJS from 'adminjs';
import { DataSource } from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import { UserRolesEnum } from '../user/enums/user-roles.enum';
import { userAdminOptions } from './resources/user.admin';
import { quizAdminOptions } from './resources/quiz.admin';
import { answerAdminOptions } from './resources/answer.admin';
import { subjectAdminOptions } from './resources/subject.admin';
import { questionAdminOptions } from './resources/question.admin';
import { Database, Resource } from '@adminjs/typeorm';
import { postAdminOptions } from './resources/post.admin';

AdminJS.registerAdapter({ Database, Resource: Resource });

@Module({
  imports: [
    MainAdminModule.createAdminAsync({
      inject: [DataSource],
      useFactory: (dataSource: DataSource) => ({
        adminJsOptions: {
          rootPath: '/admin',
          resources: [
            userAdminOptions,
            quizAdminOptions,
            answerAdminOptions,
            subjectAdminOptions,
            questionAdminOptions,
            postAdminOptions,
          ],
        },
        auth: {
          authenticate: async (username: string, password: string) => {
            const repository = dataSource.getRepository<UserEntity>('user');
            const user = await repository.findOne({
              where: { username },
              select: ['password', 'email', 'role', 'username'],
            });
            if (!user) return null;
            const passwordEquals = await bcryptjs.compare(
              password,
              user.password,
            );
            if (user && passwordEquals && user.role === UserRolesEnum.ADMIN) {
              return { username: user.username, email: user.email };
            }
            return null;
          },
          cookieName: 'adminjs',
          cookiePassword: 'secret',
        },
        sessionOptions: {
          resave: true,
          saveUninitialized: true,
          secret: 'secret',
        },
      }),
    }),
  ],
})
export class AdminModule {}
