import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './store.js';

render(
  <Provider store={store}>
    <p>Hello world</p>
  </Provider>,
  document.getElementById('app-container')
);
