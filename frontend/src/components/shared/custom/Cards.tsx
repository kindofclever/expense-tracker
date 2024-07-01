import { useState } from 'react';
import { useQuery } from '@apollo/client';
import Card from './Card';
import { GET_TRANSACTIONS } from '../../../graphql/queries/transaction.query';
import { GET_AUTHENTICATED_USER } from '../../../graphql/queries/user.query';
import { Transaction } from '../../../interfaces/interfaces';

const Cards: React.FC = () => {
  const { data: transactionsData, loading: transactionsLoading } =
    useQuery(GET_TRANSACTIONS);
  const { data: authUserData } = useQuery(GET_AUTHENTICATED_USER);

  const [filter, setFilter] = useState('');
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const filteredTransactions = transactionsData?.transactions?.filter(
    (transaction: Transaction) => {
      const filterLower = filter.toLowerCase();

      return (
        filter === '' ||
        (transaction.description?.toLowerCase().includes(filterLower) ??
          false) ||
        (transaction.paymentType?.toLowerCase().includes(filterLower) ??
          false) ||
        (transaction.amount?.toString().includes(filterLower) ?? false) ||
        (transaction.category?.toLowerCase().includes(filterLower) ?? false) ||
        (transaction.location?.toLowerCase().includes(filterLower) ?? false) ||
        (transaction.date?.toLowerCase().includes(filterLower) ?? false)
      );
    }
  );

  return (
    <div className='w-full px-10 min-h-[40vh]'>
      <p className='text-5xl font-bold text-center my-10'>History</p>
      {!transactionsLoading && transactionsData?.transactions?.length > 1 && (
        <input
          className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mb-5'
          id='filter'
          type='text'
          placeholder='Search for transactions'
          value={filter}
          onChange={handleFilterChange}
        />
      )}
      <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-start mb-20'>
        {!transactionsLoading &&
          filteredTransactions?.map((transaction: Transaction) => (
            <Card
              key={transaction.id}
              transaction={transaction}
              authUser={authUserData?.authUser}
              cardType={transaction.category}
            />
          ))}
      </div>
      {!transactionsLoading && filteredTransactions?.length === 0 && (
        <p className='text-2xl font-bold text-center w-full'>
          No transaction history found.
        </p>
      )}
      {isDialogOpen && (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
          <div className='bg-white p-6 rounded-md shadow-md'>
            <h3 className='text-lg font-bold mb-4'>Confirm Deletion</h3>
            <p>Are you sure you want to delete this transaction?</p>
            <div className='mt-6 flex justify-end gap-3'>
              <button
                className='px-4 py-2 bg-gray-300 rounded-md'
                onClick={closeDialog}>
                Cancel
              </button>
              <button
                className='px-4 py-2 bg-red-600 text-white rounded-md'
                onClick={() => {
                  handleDelete();
                  closeDialog();
                }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cards;
