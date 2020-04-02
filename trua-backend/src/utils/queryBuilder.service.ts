import { Injectable, Query } from '@nestjs/common';

@Injectable()
export class QueryBuilderService {

  buildQuery(params, entity) {
    const paginationQ = this.queryByPaginationParams(params);
    const searchQ = this.queryBySearchQuery(params, entity);
    const propQ = this.queryByProp(params);
    const where = searchQ.concat(propQ && searchQ ? 'AND' : '').concat(propQ);
    return Object.assign({}, paginationQ, {where});
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
  queryBySearchQuery(params, entity) {
    const {q} = params;
    let where = '';

    if (!q) { return where; }
    let fields = [];
    switch (entity) {
      case 'User': {
        fields = ['email', 'username'];
      }
    }
    fields.forEach((f, idx) => {
      where = where.concat(
        `"${f}" ILIKE '%${q}%'`,
      );
      if (idx !== fields.length - 1) {
        where = where.concat(' OR ');
      }
    });
    return where;
  }
  queryByProp(params) {
    const {id} = params;
    let where = '';
    where = id && `id='${id}'` || '';
    return where;
  }
}
