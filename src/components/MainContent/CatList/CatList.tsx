import React, { useState } from 'react';
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
};

export const CatList: React.FC<Props> = ({
  list,
  pageStart,
  hasMore,
  catsPerPage,
  // addCats,
}) => {
  const [addedPage, setAddedPage] = useState(pageStart + 1);
  const [listOfCatsToShow, setListOfCatsToShow] = useState(list);

  const loadFunc = () => {
    client.getPaginated<Response>(`?per_page=${catsPerPage}&page=${addedPage + 1}`)
      .then(res => {
        setListOfCatsToShow(prev => [...prev, ...res.cats]);
      })
      .finally(() => setAddedPage(prevPage => prevPage + 1));
  };

  return (
    <InfiniteScroll
      pageStart={pageStart}
      loadMore={loadFunc}
      hasMore={hasMore}
      loader={<div className="loader" key={0}>Loading ...</div>}
    >
      <div className="card-list">
        {listOfCatsToShow.map(card => (
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
                  alt={`Here should be cat ${card.name} & it's`}
                />
                <div className="card__price">{`${card.price}$`}</div>
              </div>
              <div className="card__available">
                {`Now is ${card.available ? 'available' : 'not available'}`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </InfiniteScroll>
  );
};
