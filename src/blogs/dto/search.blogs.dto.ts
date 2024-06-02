import { BaseSearchParamsDto, SearchParams } from '../../common';

export class SearchBlogsDto extends BaseSearchParamsDto {
  searchNameTerm: string | null;

  constructor(params: Partial<SearchParams>) {
    super(params);
    this.searchNameTerm = params.searchNameTerm ?? null;
  }
}
