import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';
import { IComplexRequest } from './interfaces/complex-request.interface';
import { IComplexRequestOptions } from './interfaces/complex-request-options.interface';
import { Repository } from 'typeorm';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

@Injectable()
export class UtilsService {
  constructor(private config: ConfigService) {}

  private includedEntities: string[] = [];

  includesUrl<Type>(data: Type[], fields: string[]): Type[] {
    const staticUrlPrefix = this.config.get<string>('STATIC_URL_PREFIX');
    return data.map((item) => {
      fields.forEach((field) => {
        if (item[field]) item[field] = staticUrlPrefix + item[field];
      });
      return item;
    });
  }
  includeUrl<Type>(data: Type, fields: string[]): Type {
    const staticUrlPrefix = this.config.get<string>('STATIC_URL_PREFIX');
    fields.forEach((field) => {
      if (data[field]) data[field] = staticUrlPrefix + data[field];
    });
    return data;
  }

  paginate<Type>(
    queryBuilder: SelectQueryBuilder<Type[]>,
    limit = 20,
    offset = 1,
  ): SelectQueryBuilder<Type[]> {
    const take = limit || 20;
    const page = offset || 1;
    const skip = (page - 1) * take;

    return queryBuilder.take(take).skip(skip);
  }

  search<Type>(
    queryBuilder: SelectQueryBuilder<Type[]>,
    fields: string[],
    value: string,
  ): SelectQueryBuilder<Type[]> {
    for (const field of fields) {
      queryBuilder.orWhere(`(user.${field} LIKE :search)`, {
        search: `%${value}%`,
      });
    }
    return queryBuilder;
  }

  async complexRequest<Type>(
    options: IComplexRequestOptions<Type>,
  ): Promise<IComplexRequest<Type[]>> {
    const queryBuilder = await options.repository.createQueryBuilder(
      options.entity,
    );

    if (options.relations) {
      for (const relation of options.relations) {
        this.leftJoinRecursive(
          queryBuilder,
          options.entity,
          relation.field,
          relation.entity,
        );
      }
    }

    this.includedEntities = [];

    if (options.filterQuery) {
      this.applyFilters(queryBuilder, options.filterQuery);
    }

    if (options.relationFilterQuery) {
      this.applyRelationFilters(queryBuilder, options.relationFilterQuery);
    }

    if (options.search) {
      for (const field of options.searchFields || []) {
        if (options.searchFields.indexOf(field) === 0) {
          queryBuilder.andWhere(`${options.entity}.${field} LIKE :query`);
        } else {
          queryBuilder.orWhere(`${options.entity}.${field} LIKE :query`);
        }
      }
      queryBuilder.setParameter('query', `%${options.search}%`);
    }

    let take = 0;
    let page = 0;

    if (options.limit) {
      take = options.limit;
      page = options.offset || 1;
      const skip = (page - 1) * take;

      queryBuilder.take(take).skip(skip);
    }

    const orderBy = options.orderBy || 'id';
    queryBuilder.orderBy(
      options.entity + '.' + orderBy,
      options.order || 'DESC',
    );

    const totalCount = await queryBuilder.getCount();

    const results = await queryBuilder.getMany();

    return {
      totalCount,
      offset: page,
      limit: take,
      totalPages: Math.ceil(totalCount / take) ?? 0,
      data: this.includesUrl<Type>(results, options.includeStaticPrefix || []),
    };
  }

  private leftJoinRecursive(
    queryBuilder: SelectQueryBuilder<any>,
    parentEntity: string,
    relationField: string,
    childEntity: string,
  ) {
    const relationFields = relationField.split('.');

    if (relationFields.length === 1) {
      queryBuilder.leftJoinAndSelect(
        `${parentEntity}.${relationField}`,
        childEntity,
      );
    } else {
      const firstRelation = relationFields.shift();
      const firstJoinAlias = `${parentEntity}_${firstRelation}`;

      if (!this.includedEntities.includes(firstJoinAlias)) {
        queryBuilder.leftJoinAndSelect(
          `${parentEntity}.${firstRelation}`,
          firstJoinAlias,
        );
        this.includedEntities.push(firstJoinAlias);
      }

      this.leftJoinRecursive(
        queryBuilder,
        firstJoinAlias,
        relationFields.join('.'),
        childEntity,
      );
    }
  }

  private applyFilters(
    queryBuilder: SelectQueryBuilder<any>,
    filterQuery: Record<string, any>,
  ) {
    Object.entries(filterQuery).forEach(([key, value], idx) => {
      if (idx === 0) {
        queryBuilder.andWhere(`${queryBuilder.alias}.${key} = :${key}`, {
          [key]: value,
        });
      } else {
        queryBuilder.orWhere(`${queryBuilder.alias}.${key} = :${key}`, {
          [key]: value,
        });
      }
    });
  }

  private applyRelationFilters<Type>(
    queryBuilder: SelectQueryBuilder<Type>,
    relationFilters: Array<{ query: string; value: any }>,
  ) {
    relationFilters.forEach((relationFilter, idx) => {
      if (idx === 0)
        queryBuilder.andWhere(relationFilter.query, relationFilter.value);
      else queryBuilder.orWhere(relationFilter.query, relationFilter.value);
    });
  }

  async getObjectOr404<Type>(
    repository: Repository<Type>,
    options: FindOneOptions<Type>,
    entityTitle = 'Object',
  ) {
    const object = await repository.findOne(options);
    if (!object)
      throw new NotFoundException({ message: `${entityTitle} not found` });
    return object;
  }
}
