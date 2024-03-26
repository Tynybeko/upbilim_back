import { KlassEntity } from '../../klass/entities/klass.entity';

export const klassAdminOptions = {
  resource: KlassEntity,
  options: {
    listProperties: ['id', 'title'],
  },
};
