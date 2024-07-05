import { useState, useTransition } from 'react';
import { useQuery } from '@apollo/client';
import Card from './Card';
import { GET_TRANSACTIONS } from '../../../graphql/queries/transaction.query';
import { GET_AUTHENTICATED_USER } from '../../../graphql/queries/user.query';
import { Transaction } from '../../../interfaces/interfaces';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

const Cards: React.FC = () => {
  const [offset, setOffset] = useState(0);
  const [filter, setFilter] = useState('');
  const [appliedFilter, setAppliedFilter] = useState(''); // This will hold the filter value applied on submit
  const limit = 6;

  const {
    data: transactionsData,
    loading: transactionsLoading,
    refetch,
  } = useQuery(GET_TRANSACTIONS, {
    variables: { offset, limit, filter: appliedFilter },
  });
  const { data: authUserData } = useQuery(GET_AUTHENTICATED_USER);

  const [isPending, startTransition] = useTransition();

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    startTransition(() => {
      setFilter(value);
    });
  };

  const handleFilterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAppliedFilter(filter);
    refetch({ offset, limit, filter });
  };

  const loadMoreTransactions = (direction: 'next' | 'prev') => {
    const newOffset =
      direction === 'next' ? offset + limit : Math.max(0, offset - limit);
    setOffset(newOffset);
    refetch({ offset: newOffset, limit, filter: appliedFilter });
  };

  return (
    <div className='w-full px-10 min-h-[40vh]'>
      <p className='text-5xl font-bold text-center my-10'>History</p>
      <form onSubmit={handleFilterSubmit}>
        <input
          className='appearance-none focus:focus:text-black block w-full bg-royalBlue border border-royalBlue rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-white mb-5'
          id='filter'
          type='text'
          placeholder='Search for transactions'
          value={filter}
          onChange={handleFilterChange}
        />
        <button
          type='submit'
          className='mt-2 px-4 py-2 bg-blue-500 text-white rounded'>
          Search
        </button>
      </form>
      {isPending && (
        <p className='text-center text-gray-500'>Updating transactions...</p>
      )}
      <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-start mb-20'>
        {!transactionsLoading &&
          transactionsData?.transactions?.transactions?.map(
            (transaction: Transaction) => (
              <Card
                key={transaction.id}
                transaction={transaction}
                authUser={authUserData?.authUser}
                cardType={transaction.category}
              />
            )
          )}
      </div>
      <div className='flex justify-between'>
        {offset > 0 && (
          <button
            onClick={() => loadMoreTransactions('prev')}
            className='mt-4 px-4 py-2 bg-white text-blue-500 rounded'>
            <MdKeyboardArrowLeft size={24} />
          </button>
        )}
        {transactionsData?.transactions?.transactions.length === limit && (
          <button
            onClick={() => loadMoreTransactions('next')}
            className='mt-4 px-4 py-2 bg-white text-blue-500 rounded'>
            <MdKeyboardArrowRight size={24} />
          </button>
        )}
      </div>
      {!transactionsLoading &&
        transactionsData?.transactions?.transactions.length === 0 && (
          <p className='text-2xl font-bold text-center w-full'>
            No transaction history found.
          </p>
        )}
    </div>
  );
};

export default Cards;
