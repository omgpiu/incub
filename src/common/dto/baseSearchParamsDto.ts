import { SortDirection } from 'mongodb';
import { SearchParams } from '../types';

export class BaseSearchParamsDto {
  sortBy: string;
  pageNumber: number;
  pageSize: number;
  sortDirection: SortDirection;

  constructor(params: Partial<SearchParams>) {
    this.sortBy = params.sortBy ?? 'createdAt';
    this.pageNumber = params.pageNumber ? Number(params.pageNumber) : 1;
    this.pageSize = params.pageSize ? Number(params.pageSize) : 10;
    this.sortDirection = params.sortDirection ?? 'desc';
  }
}
