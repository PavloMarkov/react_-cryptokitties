import { CatCard } from './CatCard';

export type Response = {
  cats: CatCard[],
  pagination_info: {
    total: number,
    limit_per_page: number,
    total_pages: number,
    current_page: number,
    next_page: number | null,
    prev_page: number | null,
  }
};
