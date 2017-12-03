import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/App';
import store from './store.js';
import styled from 'styled-components';

const AppStyled = styled(App)`
  font-size: 16px;
  font-family: 'Open Sans', Arial, Helvetica, sans-serif;

  background: #f0f0f0;
`;

render(
  <Provider store={store}>
    <AppStyled />
  </Provider>,
  document.getElementById('app-container')
);
