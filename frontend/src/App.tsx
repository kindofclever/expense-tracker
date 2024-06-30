import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/custom/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import TransactionPage from './pages/TransactionPage';
import NotFoundPage from './pages/NotFoundPage';

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