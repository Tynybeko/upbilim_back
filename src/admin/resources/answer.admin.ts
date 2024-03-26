import { AnswerEntity } from '../../quiz/entities/answer.entity';

export const answerAdminOptions = {
  resource: AnswerEntity,
  options: {
    listProperties: ['id', 'question_id', 'value', 'isCorrect'],
  },
};
