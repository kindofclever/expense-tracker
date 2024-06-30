import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import LoginPage from './components/pages/LoginPage';
import NotFoundPage from './components/pages/NotFoundPage';
import SignUpPage from './components/pages/SignUpPage';
import TransactionPage from './components/pages/TransactionPage';
import Header from './components/shared/custom/Header';

const App: React.FC = () => {
  const authUser = true;

  return (
    <>
      {authUser && <Header />}
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
