import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { RxReset } from 'react-icons/rx';
import Card from './Card';
import Button from './Button';
import { GET_TRANSACTIONS } from '../../../graphql/queries/transaction.query';
import { GET_AUTHENTICATED_USER } from '../../../graphql/queries/user.query';
import { Transaction } from '../../../interfaces/interfaces';

const Cards: React.FC = () => {
  const { t } = useTranslation();
  const [offset, setOffset] = useState(0);
  const [filter, setFilter] = useState('');
  const [appliedFilter, setAppliedFilter] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const limit = 6;

  const {
    data: transactionsData,
    loading: transactionsLoading,
    refetch,
  } = useQuery(GET_TRANSACTIONS, {
    variables: { offset, limit, filter: appliedFilter },
  });

  const { data: authUserData } = useQuery(GET_AUTHENTICATED_USER);

  useEffect(() => {
    if (transactionsData) {
      const transactions = transactionsData.transactions.transactions || [];
      const total = transactionsData.transactions.total || 0;

      setFilteredTransactions(transactions);
      setTotalTransactions(total);
      setTotalPages(Math.ceil(total / limit));
      setCurrentPage(Math.floor(offset / limit) + 1);

      if (offset >= total) {
        setOffset(Math.max(0, total - limit));
      }
    }
  }, [transactionsData, offset, limit]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const handleFilterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAppliedFilter(filter);
    setOffset(0);
    refetch({ offset: 0, limit, filter });
  };

  const handleFilterReset = () => {
    setFilter('');
    setAppliedFilter('');
    setOffset(0);
    refetch({ offset: 0, limit, filter: '' });
  };

  const loadMoreTransactions = (direction: 'next' | 'prev') => {
    const newOffset =
      direction === 'next' ? offset + limit : Math.max(0, offset - limit);
    setOffset(newOffset);
    refetch({ offset: newOffset, limit, filter: appliedFilter });
  };

  return (
    <div className='w-full min-h-[40vh]'>
      <p className='text-5xl font-bold text-center my-10'>{t('cards.title')}</p>
      <form
        onSubmit={handleFilterSubmit}
        className='flex items-center justify-center w-full mb-5'>
        <input
          className='h-10 appearance-none focus:focus:text-black block w-full bg-royalBlue border border-royalBlue rounded-l px-4 leading-tight focus:outline-none focus:bg-white focus:border-white'
          id='filter'
          type='text'
          placeholder={t('cards.searchPlaceholder')}
          value={filter}
          onChange={handleFilterChange}
        />
        <Button
          type='submit'
          variant='secondary'
          className='rounded-none'>
          {t('cards.searchButton')}
        </Button>
        <Button
          type='button'
          variant='secondary'
          onClick={handleFilterReset}
          className='rounded-l-none'>
          <RxReset size={24} />
        </Button>
      </form>
      {transactionsLoading && (
        <p className='text-center text-gray-500'>{t('cards.loading')}</p>
      )}
      <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-start mb-5'>
        {!transactionsLoading &&
          filteredTransactions.map((transaction: Transaction) => (
            <Card
              key={transaction.id}
              transaction={transaction}
              authUser={authUserData?.authUser}
              cardType={transaction.category}
            />
          ))}
      </div>
      {totalPages > 1 && (
        <div className='flex justify-between items-center mb-5'>
          <div>
            {offset > 0 && (
              <Button
                onClick={() => loadMoreTransactions('prev')}
                variant='secondary'>
                <MdKeyboardArrowLeft size={24} />
              </Button>
            )}
          </div>
          <div>
            <p className='text-xl font-bold'>
              {t('cards.pageInfo', { currentPage, totalPages })}
            </p>
          </div>
          <div>
            {totalTransactions > offset + limit && (
              <Button
                onClick={() => loadMoreTransactions('next')}
                variant='secondary'>
                <MdKeyboardArrowRight size={24} />
              </Button>
            )}
          </div>
        </div>
      )}
      {!transactionsLoading && filteredTransactions.length === 0 && (
        <p className='text-2xl font-bold text-center w-full'>
          {t('cards.noTransactions')}
        </p>
      )}
    </div>
  );
};

export default Cards;
