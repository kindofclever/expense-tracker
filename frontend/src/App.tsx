import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import HomePage from './components/pages/HomePage';
import LoginPage from './components/pages/LoginPage';
import NotFoundPage from './components/pages/NotFoundPage';
import SignUpPage from './components/pages/SignUpPage';
import TransactionPage from './components/pages/TransactionPage';
import Header from './components/shared/custom/Header';

import { GET_AUTHENTICATED_USER } from './graphql/queries/user.query';

const App: React.FC = () => {
  const { loading, data, error } = useQuery(GET_AUTHENTICATED_USER);

  if (loading) console.log('loading');
  if (error) console.log('error: ', error);

  console.log(data);

  return (
    <>
      {/* {data.authUser && <Header />} */}
      <Header />
      <Routes>
        <Route
          path='/'
          element={<HomePage />}
        />
        <Route
          path='/login'
          element={<LoginPage />}
        />
        <Route
          path='/signup'
          element={<SignUpPage />}
        />
        <Route
          path='/transactions/:id'
          element={<TransactionPage />}
        />
        <Route
          path='*'
          element={<NotFoundPage />}
        />
      </Routes>
    </>
  );
};

export default App;
