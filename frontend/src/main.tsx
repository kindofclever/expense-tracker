import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { HelmetProvider } from 'react-helmet-async';

import App from './App.tsx';
import './index.css';
import GridBackground from './components/shared/ui/GridBackground.tsx';

const client = new ApolloClient({
  uri:
    import.meta.env.VITE_NODE_ENV === 'development'
      ? 'http://localhost:4000/graphql'
      : '/graphql', // the URL of our GraphQL server.
  cache: new InMemoryCache(),
  credentials: 'include',
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <GridBackground>
          <ApolloProvider client={client}>
            <App />
          </ApolloProvider>
        </GridBackground>
      </HelmetProvider>
    </BrowserRouter>
  </StrictMode>
);
