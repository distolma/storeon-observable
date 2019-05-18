import React from 'react';
import ReactDOM from 'react-dom';
import StoreContext from 'storeon/react/context'
import { App } from './App';
import { store } from './store';

ReactDOM.render(
  <StoreContext.Provider value={store}>
    <App />
  </StoreContext.Provider>,
  document.getElementById('root'));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}