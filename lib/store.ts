import { createStore } from 'redux';

export interface GlobalState {
  placeholder: {};
}

const defaultReducer = (state: GlobalState) => state;

const store = createStore(defaultReducer);

export default store;
