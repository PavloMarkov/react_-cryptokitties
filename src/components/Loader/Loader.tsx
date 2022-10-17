import React from 'react';
import './Loader.scss';
import paw from './paw_loader.png';

export const Loader: React.FC = () => {
  return (
    (
      <div className="loader">
        <h2>Cat&apos;s are coming!</h2>
        <img
          className="loader__paw"
          src={paw}
          alt="loading..."
        />
      </div>
    )
  );
};
