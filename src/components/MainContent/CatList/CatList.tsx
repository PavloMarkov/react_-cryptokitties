import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { Response } from '../../../types/Response';
import { client } from '../../../api/cat';
import { CatCard } from '../../../types/CatCard';
import './CatList.scss';

type Props = {
  list: CatCard[];
  pageStart: number;
  hasMore: boolean;
  catsPerPage: number;
  addCats: (cats: CatCard[]) => void;
  nextPage: () => void;
};

export const CatList: React.FC<Props> = ({
  list, pageStart, hasMore, catsPerPage, addCats, nextPage,
}) => {
  const toShow = [...list];
  const loadFunc = () => {
    client.getPaginated<Response>(`?limit_per_page=${catsPerPage}&current_page=${pageStart + 2}`)
      .then(res => {
        addCats(res.cats);
        nextPage();
      });
  };

  return (
    <InfiniteScroll
      pageStart={pageStart}
      loadMore={loadFunc}
      hasMore={hasMore}
      loader={<div className="loader" key={0}>Loading ...</div>}
    >
      <section className="card-list page__list">
        {toShow.map(card => (
          <div
            className="card"
            key={card.id}
          >
            <div className="card__info">
              <h1 className="card__name">{card.name}</h1>
              <div className="card__img">
                <div className="card__category">
                  {card.category}
                </div>
                <img
                  src={card.image_url}
                  alt={card.name}
                />
                <div className="card__price">{`${card.price}$`}</div>
              </div>
              <div className="card__available">
                {`Now is ${card.available ? 'available' : 'not available'}`}
              </div>
            </div>
          </div>
        ))}
      </section>
    </InfiniteScroll>
  );
};
