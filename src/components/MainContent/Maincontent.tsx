/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { client } from '../../api/request';
import { CatCard } from '../../types/CatCard';
import { SortByField } from '../../types/SortByField';
import { SortMethod } from '../../types/SortMethod';
import { Loader } from '../Loader/Loader';
import './MainContent.scss';
import { Response } from '../../types/Response';
import { Page } from '../../types/Page';
import { CatList } from './CatList/CatList';
import { DataOfPage } from '../../types/DataOfPage';

export const MainContent: React.FC = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isListOfCatsLoading, setIsListOfCatsLoading] = useState(false);
  const [listOfCats, setListOfCats] = useState<CatCard[]>([]);

  const [pageData, setPageData] = useState<DataOfPage>({
    sortBy: SortByField.NONE,
    sortMethod: '',
    pageCount: 0,
    catsPerPage: 50,
    currentPage: 0,
  });

  // const [sortMethod, setSordMethod] = useState<SortMethod>('');
  // const [sortBy, setSortBy] = useState<SortByField>(SortByField.NONE);

  // const [pageCount, setPageCount] = useState(0);
  // const [catsPerPage, setCatsPerPage] = useState(50);
  // const [currentPage, setCurrentPage] = useState(0);

  const queryPaginationParams = `?page=${pageData.currentPage + 1}&per_page=${pageData.catsPerPage}`;
  const searchSortParams = `&sort_by=${pageData.sortBy || 'id'}&sort_dir=${pageData.sortMethod || 'asc'}`;

  useEffect(() => {
    setIsListOfCatsLoading(true);
    fetch(
      'https://ftl-cryptokitties.fly.dev/api/crypto_kitties',
    )
      .then(res => res.json())
      .then(res => {
        setListOfCats(res.cats);
        setPageData(prev => ({
          ...prev,
          pageCount: res.pagination_info.total_pages,
        }));
      })
      .finally(() => {
        setIsPageLoading(false);
        setIsListOfCatsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!isPageLoading) {
      setIsListOfCatsLoading(true);
      client.getPaginated<Response>(queryPaginationParams + searchSortParams)
        .then(res => {
          setListOfCats(res.cats);
          setPageData(prev => ({
            ...prev,
            pageCount: res.pagination_info.total_pages,
          }));
        })
        .finally(() => setIsListOfCatsLoading(false));
    }
  }, [pageData.currentPage]);

  const handlePageClick = (e: Page) => {
    setPageData(prev => ({
      ...prev,
      currentPage: e.selected,
    }));
  };

  const sortClickHandle = () => {
    setIsListOfCatsLoading(true);
    client.getSorted<Response>(`?${searchSortParams}`)
      .then(res => {
        setListOfCats(res.cats);
        setPageData(prev => ({
          ...prev,
          currentPage: 0,
          pageCount: res.pagination_info.total_pages,
          catsPerPage: res.pagination_info.limit_per_page,
        }));
      })
      .finally(() => setIsListOfCatsLoading(false));
  };

  // const addCats = (newCats: CatCard[]) => {
  //   setListOfCats(prevCats => [...prevCats, ...newCats]);
  // };

  return (
    <main className="page__main">
      {!isListOfCatsLoading
        ? (
          <>
            <section className="page__sort sort">
              <h4 className="sort__title">Sort by:</h4>
              <select
                onChange={(e) => setPageData(prev => ({
                  ...prev,
                  sortBy: e.target.value as SortByField,
                }))}
                className="sort__select"
                value={pageData.sortBy}
              >
                <option value={SortByField.NONE}>Need to sort?</option>
                <option value={SortByField.ID}>ID</option>
                <option value={SortByField.NAME}>Name</option>
                <option value={SortByField.CATEGORY}>Category</option>
                <option value={SortByField.PRICE}>Price</option>
              </select>
              <select
                onChange={(e) => setPageData(prev => ({
                  ...prev,
                  sortMethod: e.target.value as SortMethod,
                }))}
                className="sort__select"
                value={pageData.sortMethod}
              >
                <option value="">Sort type</option>
                <option value="asc">asc</option>
                <option value="desc">desc</option>
              </select>
              <button
                type="button"
                className="sort_btn"
                onClick={() => sortClickHandle()}
              >
                Sort cats!
              </button>
              <h4>
                Meow&apos;s per page
              </h4>
              <select
                onChange={(e) => setPageData(prev => ({
                  ...prev,
                  catsPerPage: +e.target.value,
                }))}
                className="sort__select"
                id="per-page"
                value={pageData.catsPerPage}
              >
                <option value={50}>50</option>
                <option value={20}>20</option>
                <option value={100}>100</option>
              </select>
              <button
                type="button"
                className="pagination_btn"
                onClick={() => setPageData(prev => ({
                  ...prev,
                  currentPage: 0,
                }))}
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
              forcePage={pageData.currentPage}
              pageCount={pageData.pageCount}
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
              // addCats={addCats}
              pageData={pageData}
            />
          </>
        )
        : <Loader />}
    </main>
  );
};
