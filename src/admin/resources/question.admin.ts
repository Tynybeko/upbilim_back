import { QuestionEntity } from '../../quiz/entities/question.entity';

export const questionAdminOptions = {
  resource: QuestionEntity,
  options: {
    listProperties: ['id', 'title'],
  },
};
