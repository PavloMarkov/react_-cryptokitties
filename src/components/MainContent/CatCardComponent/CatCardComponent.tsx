/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import './CatCardComponent.scss';
import { client } from '../../../api/request';
import { CatCard } from '../../../types/CatCard';
import { Loader } from '../../Loader/Loader';
import defaultImg from '../defaultPick.png';

type Props = {
  id: number;
  setId: () => void;
};

export const CatCardComponent: React.FC<Props> = ({ id, setId }) => {
  const [catCard, setCatCard] = useState<CatCard | null>(null);

  useEffect(() => {
    client.getDataFromServer<CatCard>(`/${id}`)
      .then(res => setCatCard(res));
  }, []);

  const imageOnErrorHandler = (
    event: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    event.currentTarget.src = defaultImg;
  };

  return (
    (
      catCard
        ? (
          <div className="cat-card">
            <div className="cat-card__container">
              <div className="cat-card__cancel">
                <button
                  type="button"
                  onClick={setId}
                  className="cat-card__btn-close"
                >
                  X
                </button>
              </div>
              <div className="cat-card__category">{catCard.category}</div>
              <h2 className="cat-card__name">{catCard.name}</h2>
              <div className="cat-card__price">{`${catCard.price}$`}</div>
              <div className="cat-card__img">
                <img
                  src={catCard.image_url}
                  alt={`Here should be ${catCard.name}, but sleeping is first!`}
                  onError={imageOnErrorHandler}
                  className="cat-card__foto"
                />
                <div className="cat-card__buy">
                  <button
                    type="button"
                    className="cat-card__buy-btn"
                    onClick={setId}
                  >
                    {catCard.available ? 'Buy it!' : 'At it\'s house already'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Loader />
        )
    )
  );
};
