import { SortByField } from './SortByField';
import { SortMethod } from './SortMethod';

export type DataOfPage = {
  sortBy: SortByField,
  sortMethod: SortMethod,
  pageCount: number,
  catsPerPage: number,
  currentPage: number,
};
