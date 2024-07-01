import React, { useState } from 'react';
import { FaLocationDot, FaSackDollar, FaTrash } from 'react-icons/fa6';
import { MdOutlineDescription, MdOutlinePayments } from 'react-icons/md';
import { HiPencilAlt } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { Category, Transaction, User } from '../../../interfaces/interfaces';
import { useMutation } from '@apollo/client';
import toast from 'react-hot-toast';
import { DELETE_TRANSACTION } from '../../../graphql/mutations/transaction.mutation';
import dayjs from 'dayjs';

interface CardProps {
  cardType: Category;
  transaction: Transaction;
  authUser: User;
}

const categoryColorMap: { [key in CardProps['cardType']]: string } = {
  saving: 'from-green-800 to-green-600',
  expense: 'from-pink-800 to-pink-600',
  investment: 'from-blue-700 to-blue-400',
};

const Card: React.FC<CardProps> = ({ cardType, transaction, authUser }) => {
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
      toast.success('Transaction deleted successfully');
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unknown error occurred');
      }
    }
  };

  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className={`rounded-md p-4 bg-gradient-to-br ${cardClass}`}>
      <div className='flex flex-col gap-3'>
        <div className='flex flex-row items-center justify-between'>
          <h2 className='text-lg font-bold text-white capitalize'>
            {cardType}
          </h2>
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
        <p className='text-white flex items-center gap-1'>
          <MdOutlineDescription />
          Description: {description}
        </p>
        <p className='text-white flex items-center gap-1'>
          <MdOutlinePayments />
          Payment Type: {paymentType}
        </p>
        <p className='text-white flex items-center gap-1'>
          <FaSackDollar />
          Amount: {amount}
        </p>
        <p className='text-white flex items-center gap-1'>
          <FaLocationDot />
          Location: {location}
        </p>
        <div className='flex justify-between items-center'>
          <p className='text-xs text-black font-bold'>
            {dayjs(date).format('DD.MM.YYYY')}
          </p>
          <img
            src={authUser.profilePicture}
            className='h-8 w-8 border rounded-full'
            alt='Avatar'
          />
        </div>
      </div>

      {isDialogOpen && (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
          <div className='bg-white p-6 rounded-md shadow-md'>
            <h3 className='text-lg font-bold mb-4'>Confirm Deletion</h3>
            <p className='text-red-600'>
              Are you sure you want to delete this transaction?
            </p>
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

export default Card;
