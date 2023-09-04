import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import store from './store';
import { Provider } from 'react-redux';
import Layout from './admin/components/layout/layout';
import { UserProvider } from './providers/useUser';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>

        <UserProvider>
          <Layout>
            <App />
          </Layout>

        </UserProvider>
      </BrowserRouter>
    </Provider>
    ,
  // </React.StrictMode>,
);
