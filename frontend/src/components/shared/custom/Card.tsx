import React, { useState } from 'react';
import { FaLocationDot, FaSackDollar, FaTrash } from 'react-icons/fa6';
import { MdOutlineDescription, MdOutlinePayments } from 'react-icons/md';
import { HiPencilAlt } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

import { Category, Transaction, User } from '../../../interfaces/interfaces';
import { DELETE_TRANSACTION } from '../../../graphql/mutations/transaction.mutation';
import ConfirmationDialog from './ConfirmationDialog';

interface CardProps {
  cardType: Category;
  transaction: Transaction;
  authUser: User;
}

const categoryColorMap: { [key in CardProps['cardType']]: string } = {
  saving: 'bg-royalBlue',
  expense: 'bg-orangeWheel',
  investment: 'bg-madder',
};

const Card: React.FC<CardProps> = ({ cardType, transaction, authUser }) => {
  const { t } = useTranslation();
  const { amount, location, date, paymentType, description } = transaction;
  const [isDialogOpen, setDialogOpen] = useState(false);

  const [deleteTransaction, { loading }] = useMutation(DELETE_TRANSACTION, {
    refetchQueries: ['GetTransactions', 'GetTransactionStatistics'],
  });

  const cardClass = categoryColorMap[cardType];

  const handleDelete = async () => {
    try {
      await deleteTransaction({
        variables: { transactionId: transaction.id },
      });
      toast.success(t('card.deleteSuccess'));
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(t('card.unknownError'));
      }
    }
  };

  const openDialog = () => {
    setDialogOpen(true);
  };

  if (loading) return <h2>{t('card.loading')}</h2>;

  return (
    <div className={`rounded-md p-4 ${cardClass}`}>
      <div className='flex flex-col gap-3'>
        <div className='flex flex-row items-center justify-between'>
          <h2 className='text-lg font-bold capitalize'>{cardType}</h2>
          <div className='flex items-center gap-2'>
            <FaTrash
              className='cursor-pointer'
              onClick={openDialog}
              data-testid='delete-icon'
            />
            <Link to={`/transaction/${transaction.id}`}>
              <HiPencilAlt
                className='cursor-pointer'
                size={20}
                data-testid='edit-icon'
              />
            </Link>
          </div>
        </div>
        <p className='flex items-center gap-1'>
          <MdOutlineDescription />
          {t('card.description')}: {description}
        </p>
        <p className='flex items-center gap-1'>
          <MdOutlinePayments />
          {t('card.paymentType')}: {paymentType}
        </p>
        <p className='flex items-center gap-1'>
          <FaSackDollar />
          {t('card.amount')}: {amount}
        </p>
        <p className='flex items-center gap-1'>
          <FaLocationDot />
          {t('card.location')}: {location}
        </p>
        <div className='flex justify-between items-center'>
          <p className='text-xs font-bold'>
            {dayjs(date).format('DD.MM.YYYY')}
          </p>
          <img
            src={authUser.profilePicture}
            className='h-8 w-8 border rounded-full'
            alt='Avatar'
            width={120}
            height={120}
          />
        </div>
      </div>
      <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleDelete}
        title={t('card.confirmDeletion')}
        message={t('card.confirmMessage')}
      />
    </div>
  );
};

export default Card;
