import React from 'react';
import ReactDOM from 'react-dom/client';
import './Style/index.css';
import Game from './Game/Game';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Game />
  </React.StrictMode>
);

