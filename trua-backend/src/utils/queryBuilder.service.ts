import { Injectable } from '@nestjs/common';

@Injectable()
export class QueryBuilderService {

  buildQuery(params, entity) {
    const paginationQ = this.buildPaginationQuery(params);
    const searchQ = this.buildSearchQuery(params, entity);
    return Object.assign({}, paginationQ, searchQ);
  }
    buildPaginationQuery(params) {
        const { _end, _start, _sort, _order } = params;
        const order = {
          [_sort]: _order,
        };
        const select = {
          skip: _start,
          take: _end,
        };
        const query = {
          order,
          ...select,
        };
        return query;
    }
    buildSearchQuery(params, entity): {} {
      const {q} = params;
      if (!q) { return []; }
      let fields = [];
      switch (entity) {
        case 'User': {
          fields = ['email', 'username'];
        }
      }
      let where = '';
      fields.forEach((f, idx) => {
        where = where.concat(
          `"${f}" ILIKE '%${q}%'`,
        );
        if (idx !== fields.length - 1) {
          where = where.concat(' OR ');
        }
      });
      return {where};
    }
}
