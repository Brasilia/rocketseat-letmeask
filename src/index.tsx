import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Button } from './components/Button'

import './services/firebase'

ReactDOM.render(
  <React.StrictMode>
    <App />
    <Button />
    <Button text='ola mundo' />
    <Button>{[1, 2, 3]}</Button>
  </React.StrictMode>,
  document.getElementById('root')
);
