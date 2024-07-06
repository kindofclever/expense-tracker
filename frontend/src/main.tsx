import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { HelmetProvider } from 'react-helmet-async';

import App from './App.tsx';
import './index.css';
import GridBackground from './components/shared/ui/GridBackground.tsx';
import i18n from './i18n.ts';
import { I18nextProvider } from 'react-i18next';

const client = new ApolloClient({
  uri:
    import.meta.env.VITE_NODE_ENV === 'development'
      ? 'http://localhost:4000/graphql'
      : '/graphql',
  cache: new InMemoryCache(),
  credentials: 'include',
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <GridBackground>
          <ApolloProvider client={client}>
            <I18nextProvider i18n={i18n}>
              <App />
            </I18nextProvider>
          </ApolloProvider>
        </GridBackground>
      </HelmetProvider>
    </BrowserRouter>
  </StrictMode>
);
