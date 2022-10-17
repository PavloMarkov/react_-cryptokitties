import React from 'react';
import './Footer.scss';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <section>
        <a
          href="https://github.com/PavloMarkov?tab=repositories"
          className="footer__link"
        >
          Powered by Pavlo Markov
        </a>
      </section>
    </footer>
  );
};
