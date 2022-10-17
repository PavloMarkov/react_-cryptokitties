/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { client } from '../../api/cat';
import { CatCard } from '../../types/CatCard';
import { SortByField } from '../../types/SortByField';
import { SortMethod } from '../../types/SortMethod';
import { Loader } from '../Loader/Loader';
import './MainContent.scss';
import { Response } from '../../types/Response';
import { Page } from '../../types/Page';
import { CatList } from './CatList/CatList';

export const MainContent: React.FC = () => {
  const [isListOfCatsLoading, setIsListOfCatsLoading] = useState(false);
  const [listOfCats, setListOfCats] = useState<CatCard[]>([]);

  const [sortMethod, setSordMethod] = useState<SortMethod>('');
  const [sortBy, setSortBy] = useState<SortByField>(SortByField.NONE);

  const [pageCount, setPageCount] = useState(1);
  const [catsPerPage, setCatsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    setIsListOfCatsLoading(true);
    fetch(
      'https://ftl-cryptokitties.fly.dev/api/crypto_kitties',
    )
      .then(res => res.json())
      .then(res => {
        setListOfCats(res.cats);
        setPageCount(res.pagination_info.total_pages);
      })
      .finally(() => setIsListOfCatsLoading(false));
  }, []);

  const handlePageClick = (e: Page) => {
    console.log(e);

    setCurrentPage(e.selected);
    setIsListOfCatsLoading(true);
    client.getPaginated<Response>(`?limit_per_page=${catsPerPage}&current_page=${currentPage + 1}`)
      .then(res => setListOfCats(res.cats))
      .finally(() => setIsListOfCatsLoading(false));
  };

  const addCats = (newCats: CatCard[]) => {
    setListOfCats(prev => [...prev, ...newCats]);
  };

  const addNextPageData = () => setCurrentPage(prev => prev + 1);

  return (
    <main className="page__main">
      {!isListOfCatsLoading
        ? (
          <>
            <section className="page__sort sort">
              <h4 className="sort__title">Sort by:</h4>
              <select
                onChange={(e) => setSortBy(e.target.value as SortByField)}
                className="sort__select"
                value={sortBy}
              >
                <option value={SortByField.NONE}>Need to sort?</option>
                <option value={SortByField.ID}>ID</option>
                <option value={SortByField.NAME}>Name</option>
                <option value={SortByField.CATEGORY}>Category</option>
                <option value={SortByField.PRICE}>Price</option>
              </select>
              <select
                onChange={(e) => setSordMethod(e.target.value as SortMethod)}
                className="sort__select"
                value={sortMethod}
              >
                <option value="">Sort type</option>
                <option value="asc">asc</option>
                <option value="desc">desc</option>
              </select>
              <button
                type="button"
                className="sort_btn"
                onClick={() => {
                  setIsListOfCatsLoading(true);
                  client.getSorted<Response>(`?sort_by=${sortBy || 'id'}&sort_dir=${sortMethod || 'asc'}`)
                    .then(res => setListOfCats(res.cats))
                    .finally(() => setIsListOfCatsLoading(false));
                }}
              >
                Sort cats!
              </button>
              <h4>
                Meow&apos;s per page
              </h4>
              <select
                onChange={(e) => setCatsPerPage(+e.target.value)}
                className="sort__select"
                id="per-page"
                value={catsPerPage}
              >
                <option value={50}>50</option>
                <option value={20}>20</option>
                <option value={100}>100</option>
              </select>
              <button
                type="button"
                className="pagination_btn"
                onClick={() => {
                  setCurrentPage(0);
                  client.getPaginated<Response>(`?per_page=${catsPerPage}&page=${currentPage + 1}`)
                    .then(res => {
                      setListOfCats(res.cats);
                      setPageCount(res.pagination_info.total_pages);
                    });
                }}
              >
                View cats!
              </button>
            </section>
            <ReactPaginate
              breakLabel="..."
              nextLabel="next >"
              previousLabel="< prev"
              onPageChange={handlePageClick}
              pageRangeDisplayed={3}
              marginPagesDisplayed={1}
              pageCount={pageCount}
              containerClassName="pagination__container"
              previousLinkClassName="pagination__previous"
              breakClassName="pagination__page"
              nextLinkClassName="pagination__next"
              pageClassName="pagination__page"
              disabledClassName="pagination__disabled"
              activeClassName="pagination__active"
              activeLinkClassName="pagination__link"
            />
            <CatList
              list={listOfCats}
              pageStart={currentPage}
              hasMore={pageCount > currentPage}
              catsPerPage={catsPerPage}
              addCats={addCats}
              nextPage={addNextPageData}
            />
          </>
        )
        : <Loader />}
    </main>
  );
};
