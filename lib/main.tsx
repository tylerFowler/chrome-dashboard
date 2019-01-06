import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Page from './Page';
import store from './store.js';

render(
  <Provider store={store}>
    <Page />
  </Provider>,
  document.getElementById('app-container'),
);
