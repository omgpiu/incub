import { BaseSearchParamsDto, SearchParams } from '../../common';

export class SearchPostsDto extends BaseSearchParamsDto {
  constructor(params: Partial<Omit<SearchParams, 'searchNameTerm'>>) {
    super(params);
  }
}
