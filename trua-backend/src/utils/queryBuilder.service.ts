import { Injectable, Query } from '@nestjs/common';

@Injectable()
export class QueryBuilderService {

  buildQuery(params, entity) {
    const paginationQ = this.queryByPaginationParams(params);
    const searchQ = this.queryBySearchQuery(params, entity);
    const propQ = this.queryByProp(params);
    return Object.assign({}, paginationQ, searchQ, propQ);
  }
    queryByPaginationParams(params) {
        const { _end, _start, _sort, _order } = params;
        let order = null;
        let select = null;
        if (_sort && _order) {
          order = {
            [_sort]: _order,
          };
        }
        if (_start && _end) {
          select = {
            skip: _start,
            take: _end,
          };
        }
        return Object.assign({}, order, select);
    }
    queryBySearchQuery(params, entity): {} {
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
    queryByProp(params) {
      const {id} = params;
      const where = Object.assign({}, id && {id});
      return {where};
    }
}
