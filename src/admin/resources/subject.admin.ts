import { SubjectEntity } from '../../subject/entities/subject.entity';

export const subjectAdminOptions = {
  resource: SubjectEntity,
  options: {
    listProperties: ['id', 'title'],
  },
};
