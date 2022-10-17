import React from 'react';
import './App.scss';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { MainContent } from './components/MainContent/Maincontent';

export const App: React.FC = () => {
  return (
    <div className="page">
      <Header />
      <MainContent />
      <Footer />
    </div>
  );
};
