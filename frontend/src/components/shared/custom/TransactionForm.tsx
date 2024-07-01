import React, { useState, FormEvent } from 'react';
import { useMutation } from '@apollo/client';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

import { Category, PaymentType } from '../../../interfaces/interfaces';
import { CREATE_TRANSACTION } from '../../../graphql/mutations/transaction.mutation';

const TransactionForm: React.FC = () => {
  const [createTransaction, { loading }] = useMutation(CREATE_TRANSACTION, {
    refetchQueries: ['GetTransactions', 'GetTransactionStatistics'],
  });

  const today = dayjs().format('YYYY-MM-DD');
  const [selectedDate, setSelectedDate] = useState(today);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const transactionData = {
      description: formData.get('description') as string,
      paymentType: formData.get('paymentType') as string,
      category: formData.get('category') as string,
      amount: parseFloat(formData.get('amount') as string),
      location: formData.get('location') as string,
      date: formData.get('date') as string,
    };

    try {
      await createTransaction({ variables: { input: transactionData } });

      form.reset();
      setSelectedDate(today); // Reset the date to today after successful submission
      toast.success('Transaction created successfully');
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unknown error occurred');
      }
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  return (
    <form
      className='w-full max-w-lg flex flex-col gap-5 px-3'
      onSubmit={handleSubmit}>
      {/* TRANSACTION */}
      <div className='flex flex-wrap'>
        <div className='w-full'>
          <label
            className='block uppercase tracking-wide text-white text-xs font-bold mb-2'
            htmlFor='description'>
            Transaction
          </label>
          <input
            className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
            id='description'
            name='description'
            type='text'
            required
            placeholder='Rent, Groceries, Salary, etc.'
          />
        </div>
      </div>
      {/* PAYMENT TYPE */}
      <div className='flex flex-wrap gap-3'>
        <div className='w-full flex-1 mb-6 md:mb-0'>
          <label
            className='block uppercase tracking-wide text-white text-xs font-bold mb-2'
            htmlFor='paymentType'>
            Payment Type
          </label>
          <div className='relative'>
            <select
              className='block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
              id='paymentType'
              required
              name='paymentType'>
              {Object.values(PaymentType).map((type) => (
                <option
                  key={type}
                  value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
              <svg
                className='fill-current h-4 w-4'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'>
                <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
              </svg>
            </div>
          </div>
        </div>

        {/* CATEGORY */}
        <div className='w-full flex-1 mb-6 md:mb-0'>
          <label
            className='block uppercase tracking-wide text-white text-xs font-bold mb-2'
            htmlFor='category'>
            Category
          </label>
          <div className='relative'>
            <select
              className='block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
              id='category'
              required
              name='category'>
              {Object.values(Category).map((type) => (
                <option
                  key={type}
                  value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
              <svg
                className='fill-current h-4 w-4'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'>
                <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
              </svg>
            </div>
          </div>
        </div>

        {/* AMOUNT */}
        <div className='w-full flex-1 mb-6 md:mb-0'>
          <label
            className='block uppercase text-white text-xs font-bold mb-2'
            htmlFor='amount'>
            Amount
          </label>
          <input
            className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
            id='amount'
            name='amount'
            type='number'
            required
            placeholder='150'
          />
        </div>
      </div>

      {/* LOCATION */}
      <div className='flex flex-wrap gap-3'>
        <div className='w-full flex-1 mb-6 md:mb-0'>
          <label
            className='block uppercase tracking-wide text-white text-xs font-bold mb-2'
            htmlFor='location'>
            Location
          </label>
          <input
            className='appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white'
            id='location'
            name='location'
            required
            type='text'
            placeholder='St. Gallen'
          />
        </div>

        {/* DATE */}
        <div className='w-full flex-1'>
          <label
            className='block uppercase tracking-wide text-white text-xs font-bold mb-2'
            htmlFor='date'>
            Date
          </label>
          <input
            value={selectedDate}
            onChange={handleDateChange}
            required
            type='date'
            name='date'
            id='date'
            className='appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-[11px] px-4 mb-3 leading-tight focus:outline-none focus:bg-white'
            placeholder='Select date'
          />
        </div>
      </div>
      {/* SUBMIT BUTTON */}
      <button
        className='text-white font-bold w-full rounded px-4 py-2 bg-gradient-to-br from-pink-500 to-pink-500 hover:from-pink-600 hover:to-pink-600 disabled:opacity-70 disabled:cursor-not-allowed'
        type='submit'
        disabled={loading}>
        {loading ? 'Loading...' : 'Add Transaction'}
      </button>
    </form>
  );
};

export default TransactionForm;
