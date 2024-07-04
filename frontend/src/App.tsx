import { Routes, Route, Navigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import HomePage from './components/pages/HomePage';
import LoginPage from './components/pages/LoginPage';
import NotFoundPage from './components/pages/NotFoundPage';
import SignUpPage from './components/pages/SignUpPage';
import TransactionPage from './components/pages/TransactionPage';
import Header from './components/shared/custom/Header';

import { GET_AUTHENTICATED_USER } from './graphql/queries/user.query';
import CustomToaster from './components/shared/custom/CustomToaster';

const App: React.FC = () => {
  const { data } = useQuery(GET_AUTHENTICATED_USER);

  return (
    <>
      {data?.authUser && <Header />}
      <Routes>
        <Route
          path='/'
          element={data?.authUser ? <HomePage /> : <Navigate to='/login' />}
        />
        <Route
          path='/login'
          element={!data?.authUser ? <LoginPage /> : <Navigate to='/' />}
        />
        <Route
          path='/signup'
          element={!data?.authUser ? <SignUpPage /> : <Navigate to='/' />}
        />
        <Route
          path='/transaction/:id'
          element={
            data?.authUser ? <TransactionPage /> : <Navigate to='/login' />
          }
        />
        <Route
          path='*'
          element={<NotFoundPage />}
        />
      </Routes>
      <CustomToaster />
    </>
  );
};

export default App;
