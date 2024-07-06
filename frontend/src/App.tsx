import { Routes, Route, Navigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import HomePage from './components/pages/HomePage';
import LoginPage from './components/pages/LoginPage';
import NotFoundPage from './components/pages/NotFoundPage';
import SignUpPage from './components/pages/SignUpPage';
import TransactionPage from './components/pages/TransactionPage';
import UserPage from './components/pages/UserPage';

import { GET_AUTHENTICATED_USER } from './graphql/queries/user.query';
import CustomToaster from './components/shared/custom/CustomToaster';
import Layout from './components/layout/Layout';
import CustomHelmet from './components/shared/custom/CustomHelmet';

const App: React.FC = () => {
  const { data } = useQuery(GET_AUTHENTICATED_USER);

  return (
    <>
      <CustomHelmet canonical='/' />
      <Routes>
        <Route element={<Layout />}>
          <Route
            path='/'
            element={data?.authUser ? <HomePage /> : <Navigate to='/login' />}
          />
          <Route
            path='/users/:id'
            element={data?.authUser ? <UserPage /> : <Navigate to='/' />}
          />
          <Route
            path='/transaction/:id'
            element={
              data?.authUser ? <TransactionPage /> : <Navigate to='/login' />
            }
          />
        </Route>
        {/* Routes without Layout */}
        <Route
          path='/login'
          element={!data?.authUser ? <LoginPage /> : <Navigate to='/' />}
        />
        <Route
          path='/signup'
          element={!data?.authUser ? <SignUpPage /> : <Navigate to='/' />}
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
