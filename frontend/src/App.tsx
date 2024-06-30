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
import { Toaster } from 'react-hot-toast';
import PublicRoute from './components/shared/custom/PublicRoute';
import ProtectedRoute from './components/shared/custom/ProtectedRoute';

const App: React.FC = () => {
  const { loading, data, error } = useQuery(GET_AUTHENTICATED_USER);

  if (loading) console.log('loading');
  if (error) console.log('error: ', error);

  return (
    <>
      {data?.authUser && <Header />}
      <Routes>
        <Route
          path='/'
          element={
            <ProtectedRoute
              isAuthenticated={!!data?.authUser}
              redirectPath='/login'
              element={<HomePage />}
            />
          }
        />
        <Route
          path='/login'
          element={
            <PublicRoute
              isAuthenticated={!!data?.authUser}
              redirectPath='/'
              element={<LoginPage />}
            />
          }
        />
        <Route
          path='/signup'
          element={
            <PublicRoute
              isAuthenticated={!!data?.authUser}
              redirectPath='/'
              element={<SignUpPage />}
            />
          }
        />
        <Route
          path='/transaction/:id'
          element={
            <ProtectedRoute
              isAuthenticated={!!data?.authUser}
              redirectPath='/login'
              element={<TransactionPage />}
            />
          }
        />
        <Route
          path='*'
          element={<NotFoundPage />}
        />
      </Routes>
      <Toaster />
    </>
  );
};

export default App;
