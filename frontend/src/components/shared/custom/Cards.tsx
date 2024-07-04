import { useState, useTransition } from 'react';
import { useQuery } from '@apollo/client';
import Card from './Card';
import { GET_TRANSACTIONS } from '../../../graphql/queries/transaction.query';
import { GET_AUTHENTICATED_USER } from '../../../graphql/queries/user.query';
import { Transaction } from '../../../interfaces/interfaces';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

const Cards: React.FC = () => {
  const [offset, setOffset] = useState(0);
  const limit = 6;

  const {
    data: transactionsData,
    loading: transactionsLoading,
    fetchMore,
  } = useQuery(GET_TRANSACTIONS, {
    variables: { offset, limit },
  });
  const { data: authUserData } = useQuery(GET_AUTHENTICATED_USER);

  const [filter, setFilter] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    startTransition(() => {
      setFilter(value);
    });
  };

  const loadMoreTransactions = (direction: 'next' | 'prev') => {
    const newOffset =
      direction === 'next' ? offset + limit : Math.max(0, offset - limit);
    fetchMore({
      variables: {
        offset: newOffset,
        limit,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) return previousResult;

        return fetchMoreResult;
      },
    });
    setOffset(newOffset);
  };

  const filteredTransactions =
    transactionsData?.transactions?.transactions?.filter(
      (transaction: Transaction) => {
        const filterLower = filter.toLowerCase();

        return (
          filter === '' ||
          (transaction.description?.toLowerCase().includes(filterLower) ??
            false) ||
          (transaction.paymentType?.toLowerCase().includes(filterLower) ??
            false) ||
          (transaction.amount?.toString().includes(filterLower) ?? false) ||
          (transaction.category?.toLowerCase().includes(filterLower) ??
            false) ||
          (transaction.location?.toLowerCase().includes(filterLower) ??
            false) ||
          (transaction.date?.toLowerCase().includes(filterLower) ?? false)
        );
      }
    );

  return (
    <div className='w-full px-10 min-h-[40vh]'>
      <p className='text-5xl font-bold text-center my-10'>History</p>
      {!transactionsLoading &&
        transactionsData?.transactions?.transactions?.length > 1 && (
          <input
            className='appearance-none focus:focus:text-black block w-full bg-royalBlue border border-royalBlue rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-white mb-5'
            id='filter'
            type='text'
            placeholder='Search for transactions'
            value={filter}
            onChange={handleFilterChange}
          />
        )}
      {isPending && (
        <p className='text-center text-gray-500'>Updating transactions...</p>
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
      {!transactionsLoading && filteredTransactions?.length === 0 && (
        <p className='text-2xl font-bold text-center w-full'>
          No transaction history found.
        </p>
      )}
    </div>
  );
};

export default Cards;
