import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Use createRoot to render your app
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);
