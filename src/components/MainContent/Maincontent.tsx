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
import { ArrowUp } from '../ArrowUp/ArrowUp';

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
      client.getDataFromServer<Response>(queryPaginationParams + searchSortParams)
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
    client.getDataFromServer<Response>(`?${searchSortParams}&page=1&per_page=${pageData.catsPerPage}`)
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

  return (
    <main className="page__main">
      {!isListOfCatsLoading
        ? (
          <>
            <ArrowUp />
            <ReactPaginate
              breakLabel="..."
              nextLabel=">"
              previousLabel="<"
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
            <div className="page__sort sort">
              <section className="sort__field">
                <select
                  onChange={(e) => setPageData(prev => ({
                    ...prev,
                    sortBy: e.target.value as SortByField,
                  }))}
                  className="sort__select"
                  value={pageData.sortBy}
                >
                  <option value={SortByField.NONE}>Need to sort?</option>
                  <option value={SortByField.ID}>By ID</option>
                  <option value={SortByField.NAME}>By Name</option>
                  <option value={SortByField.CATEGORY}>By Category</option>
                  <option value={SortByField.PRICE}>By Price</option>
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
                  className="sort__btn"
                  onClick={() => sortClickHandle()}
                >
                  Sort cats!
                </button>
              </section>
              <section className="sort__field">
                <label htmlFor="per-page">
                  Meow&apos;s per page:
                  <select
                    onChange={(e) => setPageData(prev => ({
                      ...prev,
                      catsPerPage: +e.target.value,
                    }))}
                    className="sort__select"
                    id="per-page"
                    value={pageData.catsPerPage}
                  >
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </label>
                <button
                  type="button"
                  className="sort__btn"
                  onClick={sortClickHandle}
                >
                  View cats!
                </button>
              </section>
            </div>
            <CatList
              list={listOfCats}
              pageData={pageData}
            />
          </>
        )
        : <Loader />}
    </main>
  );
};
