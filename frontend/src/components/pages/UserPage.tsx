import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { toast } from 'react-hot-toast';
import SubHeader from '../shared/custom/SubHeader';
import { GET_AUTHENTICATED_USER } from '../../graphql/queries/user.query';
import {
  DELETE_ALL_TRANSACTIONS,
  GET_TRANSACTION_STATISTICS,
  GET_TRANSACTIONS,
} from '../../graphql/queries/transaction.query';
import ConfirmationDialog from '../shared/custom/ConfirmationDialog';
import Button from '../shared/custom/Button';
import CustomHelmet from '../shared/custom/CustomHelmet';

const UserPage: React.FC = () => {
  const {
    loading: authLoading,
    data: authData,
    error: authError,
  } = useQuery(GET_AUTHENTICATED_USER);
  const {
    loading: transactionsLoading,
    data: transactionsData,
    error: transactionsError,
  } = useQuery(GET_TRANSACTIONS, {
    variables: { offset: 0, limit: 1, filter: '' }, // Fetch only 1 transaction to check if there are any
  });
  const [isDialogOpen, setDialogOpen] = useState(false);

  const [deleteAllTransactions] = useMutation(DELETE_ALL_TRANSACTIONS, {
    onCompleted: (data) => {
      if (data.deleteAllTransactions.success) {
        toast.success('All transactions deleted successfully!');
        handleClose();
      } else {
        toast.error(
          data.deleteAllTransactions.message || 'Failed to delete transactions.'
        );
      }
    },
    onError: (error) => {
      toast.error(error.message || 'An error occurred.');
    },
    refetchQueries: [
      { query: GET_TRANSACTION_STATISTICS },
      {
        query: GET_TRANSACTIONS,
        variables: { offset: 0, limit: 6, filter: '' },
      },
    ],
  });

  if (authLoading || transactionsLoading) return <p>...Loading</p>;
  if (authError || transactionsError)
    return <p>Error: {authError?.message || transactionsError?.message}</p>;

  const authUser = authData?.authUser;
  const transactions = transactionsData?.transactions?.transactions;

  if (!authUser) return <p>You must be logged in to view this page.</p>;

  const handleDeleteAll = () => {
    deleteAllTransactions({ variables: { userId: authUser.id } });
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <CustomHelmet
        title='Profile Page - Expense Tracker'
        description='Overwiev your account on Expense Tracker to start managing your finances efficiently.'
        keywords='Sign Up, Expense Tracker, Budgeting, Finance'
        canonical='/signup'
      />
      <div className='min-h-screen flex flex-col justify-start items-center'>
        <div className='flex items-center gap-x-5 mb-5'>
          <SubHeader text={`Welcome to your profile, ${authUser.username}!`} />
          <img
            src={authUser.profilePicture}
            alt={`${authUser.username}'s profile`}
          />
        </div>
        {transactions && transactions.length > 0 && (
          <div className='flex justify-start items-center gap-x-5'>
            <p>Click the button to delete all your transactions</p>
            <Button
              onClick={() => setDialogOpen(true)}
              variant='danger'>
              Delete
            </Button>
          </div>
        )}
        <ConfirmationDialog
          isOpen={isDialogOpen}
          onClose={handleClose}
          onConfirm={handleDeleteAll}
          title='Delete All Transactions'
          message='Are you sure you want to delete all transactions? This action cannot be undone.'
        />
      </div>
    </>
  );
};

export default UserPage;
