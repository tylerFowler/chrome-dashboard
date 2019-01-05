import { createStore } from 'redux';

const defaultReducer = (state: any): any => state;

const store = createStore(defaultReducer);

export default store;
