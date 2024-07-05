import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  GET_AUTHENTICATED_USER,
  GET_USER_AND_TRANSACTIONS,
} from '../../graphql/queries/user.query';
import SubHeader from '../shared/custom/SubHeader';

const UserPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const {
    loading: authLoading,
    data: authData,
    error: authError,
  } = useQuery(GET_AUTHENTICATED_USER);
  const {
    loading: userLoading,
    data: userData,
    error: userError,
  } = useQuery(GET_USER_AND_TRANSACTIONS, {
    variables: { userId: id },
  });

  if (authLoading || userLoading) return <p>...Loading</p>;
  if (authError || userError)
    return <p>Error: {authError?.message || userError?.message}</p>;

  const authUser = authData?.authUser;
  const user = userData?.user;

  if (!authUser) return <p>You must be logged in to view this page.</p>;

  return (
    <div className='min-h-screen flex justify-center items-start'>
      <div className='flex items-center gap-x-5'>
        <SubHeader
          text={`Welcome to you profile, ${authData?.authUser.username}!`}
        />
        <img
          src={user.profilePicture}
          alt={`${user.name}'s profile`}
        />
      </div>
    </div>
  );
};

export default UserPage;
