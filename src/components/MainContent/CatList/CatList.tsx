import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { Response } from '../../../types/Response';
import { client } from '../../../api/request';
import { CatCard } from '../../../types/CatCard';
import './CatList.scss';
import { DataOfPage } from '../../../types/DataOfPage';
import { CatCardComponent } from '../CatCardComponent/CatCardComponent';

type Props = {
  list: CatCard[];
  pageData: DataOfPage;
};

export const CatList: React.FC<Props> = ({
  list,
  pageData,
}) => {
  const [addedPage, setAddedPage] = useState(pageData.currentPage + 1);
  const [listOfCatsToShow, setListOfCatsToShow] = useState(list);
  const [catId, setCatId] = useState(0);

  const setId = () => {
    setCatId(0);
  };

  const loadMoreCats = () => {
    client.getDataFromServer<Response>(`?per_page=${pageData.catsPerPage}&page=${addedPage + 1}&sort_by=${pageData.sortBy || 'id'}&sort_dir=${pageData.sortMethod || 'asc'}`)
      .then(res => {
        setListOfCatsToShow(prev => [...prev, ...res.cats]);
        setAddedPage(prevPage => prevPage + 1);
      });
  };

  return (
    <>
      <InfiniteScroll
        pageStart={pageData.currentPage}
        loadMore={loadMoreCats}
        hasMore={pageData.pageCount > addedPage}
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
                  <button
                    type="button"
                    className="card__available"
                    onClick={() => setCatId(card.id)}
                  >
                    {`Now is ${card.available ? 'available' : 'not available'}`}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </InfiniteScroll>
      {catId !== 0 && <CatCardComponent id={catId} setId={setId} />}
    </>
  );
};
