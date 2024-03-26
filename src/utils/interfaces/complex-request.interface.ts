export interface IComplexRequest<Type> {
  totalCount: number;
  offset: number;
  limit: number;
  totalPages: number;
  data: Type;
}
