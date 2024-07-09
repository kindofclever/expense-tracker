import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdAdd,
} from 'react-icons/md';
import { RxReset } from 'react-icons/rx';
import Card from './Card';
import Button from './Button';
import CustomTagDialog from './CustomTagDialog';
import { GET_TRANSACTIONS } from '../../../graphql/queries/transaction.query';
import { GET_AUTHENTICATED_USER } from '../../../graphql/queries/user.query';
import { Category, Transaction } from '../../../interfaces/interfaces';
import { GET_CUSTOM_TAGS } from '../../../graphql/queries/tag.query';

interface CustomTag {
  id: string;
  name: string;
  searchTerm: string;
}

const Cards: React.FC = () => {
  const { t } = useTranslation();
  const [offset, setOffset] = useState<number>(0);
  const [filter, setFilter] = useState<string>('');
  const [appliedFilter, setAppliedFilter] = useState<string>('');
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [totalTransactions, setTotalTransactions] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [customTags, setCustomTags] = useState<CustomTag[]>([]);

  const limit = 6;
  const categories = Object.values(Category);

  const {
    data: transactionsData,
    loading: transactionsLoading,
    refetch,
  } = useQuery(GET_TRANSACTIONS, {
    variables: { offset, limit, filter: appliedFilter },
  });

  const { data: authUserData } = useQuery(GET_AUTHENTICATED_USER);

  const { data: customTagsData, refetch: refetchCustomTags } =
    useQuery(GET_CUSTOM_TAGS);

  useEffect(() => {
    if (transactionsData) {
      const { transactions, total } = transactionsData.transactions;
      setFilteredTransactions(transactions);
      setTotalTransactions(total);
      setTotalPages(Math.ceil(total / limit));
      setCurrentPage(Math.floor(offset / limit) + 1);

      if (offset >= total) {
        setOffset(Math.max(0, total - limit));
      }
    }
  }, [transactionsData, offset, limit]);

  useEffect(() => {
    if (customTagsData) {
      setCustomTags(customTagsData.customTags);
    }
  }, [customTagsData]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFilter(e.target.value);

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

  const handleCategoryClick = (category: string) => {
    const partialFilter = category.slice(0, 3);
    setAppliedFilter(partialFilter);
    setOffset(0);
    refetch({ offset: 0, limit, filter: partialFilter });
  };

  const handleAllCategoriesClick = () => {
    setAppliedFilter('');
    setOffset(0);
    refetch({ offset: 0, limit, filter: '' });
  };

  const handleCustomTagClick = (searchTerm: string) => {
    setAppliedFilter(searchTerm);
    setOffset(0);
    refetch({ offset: 0, limit, filter: searchTerm });
  };

  const loadMoreTransactions = (direction: 'next' | 'prev') => {
    const newOffset =
      direction === 'next' ? offset + limit : Math.max(0, offset - limit);
    setOffset(newOffset);
    refetch({ offset: newOffset, limit, filter: appliedFilter });
  };

  const handleDialogOpen = () => setIsDialogOpen(true);
  const handleDialogClose = () => setIsDialogOpen(false);
  const handleTagCreated = () => refetchCustomTags();

  return (
    <section className='w-full min-h-[40vh]'>
      <p className='text-5xl font-bold text-center my-5'>{t('cards.title')}</p>
      <form
        onSubmit={handleFilterSubmit}
        className='flex items-center justify-end mb-5'>
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
      <div className='flex justify-end mb-5 gap-5'>
        <Button
          variant='primary'
          onClick={handleAllCategoriesClick}>
          {t('cards.allTransactions')}
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={category}
            onClick={() => handleCategoryClick(category)}
            className='capitalize'>
            {t(`homePage.categories.${category.toLowerCase()}`)}
          </Button>
        ))}
        {customTags.map((tag) => (
          <Button
            key={tag.id}
            variant='secondary'
            onClick={() => handleCustomTagClick(tag.searchTerm)}
            className='capitalize'>
            {tag.name}
          </Button>
        ))}
        <Button
          variant='secondary'
          onClick={handleDialogOpen}>
          <MdAdd size={24} />
        </Button>
      </div>
      {transactionsLoading && (
        <p className='text-center text-gray-500'>{t('cards.loading')}</p>
      )}
      <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-start mb-5'>
        {!transactionsLoading &&
          filteredTransactions.map((transaction) => (
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
            {currentPage > 1 && (
              <Button
                onClick={() => loadMoreTransactions('prev')}
                variant='secondary'
                disabled={offset === 0}>
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
            {currentPage < totalPages && (
              <Button
                onClick={() => loadMoreTransactions('next')}
                variant='secondary'
                disabled={offset + limit >= totalTransactions}>
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
      <CustomTagDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onTagCreated={handleTagCreated}
      />
    </section>
  );
};

export default Cards;
