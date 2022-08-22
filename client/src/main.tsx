import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import 'animate.css/animate.min.css';
import App from './App';
import Layout from '@components/Layout/Layout';
import GlobalStyle from './styles/Global';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import React from 'react';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <RecoilRoot>
        <GlobalStyle />
        <HelmetProvider>
          <Layout>
            <App />
          </Layout>
        </HelmetProvider>
      </RecoilRoot>
    </BrowserRouter>
  </React.StrictMode>,
);
