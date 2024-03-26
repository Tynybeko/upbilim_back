import { QuizEntity } from '../../quiz/entities/quiz.entity';

export const quizAdminOptions = {
  resource: QuizEntity,
  options: {
    listProperties: ['id', 'title'],
  },
};
