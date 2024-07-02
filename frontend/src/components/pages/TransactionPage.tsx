import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';

import { UPDATE_TRANSACTION } from '../../graphql/mutations/transaction.mutation';
import {
  GET_TRANSACTION,
  GET_TRANSACTION_STATISTICS,
} from '../../graphql/queries/transaction.query';
import {
  PaymentType,
  Category,
  Transaction,
} from '../../interfaces/interfaces';
import TransactionFormSkeleton from '../shared/skeletons/TransactionFormSkeleton';
import Button from '../shared/custom/Button';

const TransactionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { loading, data } = useQuery(GET_TRANSACTION, {
    variables: { id },
  });

  const navigate = useNavigate();

  const [updateTransaction, { loading: loadingUpdate }] = useMutation(
    UPDATE_TRANSACTION,
    {
      refetchQueries: [{ query: GET_TRANSACTION_STATISTICS }],
    }
  );

  const [formData, setFormData] = useState<Partial<Transaction>>({
    description: '',
    paymentType: PaymentType.cash,
    category: Category.saving,
    amount: 0,
    location: '',
    date: '',
  });

  useEffect(() => {
    if (data?.transaction) {
      setFormData({
        description: data.transaction.description,
        paymentType: data.transaction.paymentType,
        category: data.transaction.category,
        amount: data.transaction.amount,
        location: data.transaction.location,
        date: dayjs(data.transaction.date).format('YYYY-MM-DD'),
      });
    }
  }, [data]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount as unknown as string);

    try {
      await updateTransaction({
        variables: {
          input: {
            ...formData,
            amount,
            transactionId: id,
          },
        },
      });
      toast.success('Transaction updated successfully');
      navigate('/');
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unknown error occurred');
      }
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  if (loading) return <TransactionFormSkeleton />;

  return (
    <div className='h-screen max-w-4xl mx-auto flex flex-col items-center'>
      <p className='md:text-4xl text-2xl lg:text-4xl font-bold text-center relative z-50 mb-4 mr-4 bg-gradient-to-r from-orangeWheel via-royalBlue to-madder inline-block text-transparent bg-clip-text'>
        Update this transaction
      </p>
      <form
        className='w-full max-w-lg flex flex-col gap-5 px-3'
        onSubmit={handleSubmit}>
        {/* TRANSACTION */}
        <div className='flex flex-wrap'>
          <div className='w-full'>
            <label
              className='block uppercase tracking-wide text-xs font-bold mb-2'
              htmlFor='description'>
              Transaction
            </label>
            <input
              className='appearance-none block w-full focus:text-black bg-royalBlue border border-royalBlue rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-white'
              id='description'
              name='description'
              type='text'
              placeholder='Rent, Groceries, Salary, etc.'
              value={formData.description || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>
        {/* PAYMENT TYPE */}
        <div className='flex flex-wrap gap-3'>
          <div className='w-full flex-1 mb-6 md:mb-0'>
            <label
              className='block uppercase tracking-wide text-xs font-bold mb-2'
              htmlFor='paymentType'>
              Payment Type
            </label>
            <div className='relative'>
              <select
                className='block appearance-none w-full focus:text-black bg-royalBlue border border-royalBlue  py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-white'
                id='paymentType'
                name='paymentType'
                onChange={handleInputChange}
                value={formData.paymentType}>
                {Object.values(PaymentType).map((type) => (
                  <option
                    key={type}
                    value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
              <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 '>
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
              className='block uppercase tracking-wide  text-xs font-bold mb-2'
              htmlFor='category'>
              Category
            </label>
            <div className='relative'>
              <select
                className='block appearance-none focus:text-black w-full bg-royalBlue border border-royalBlue  py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-white'
                id='category'
                name='category'
                onChange={handleInputChange}
                value={formData.category || Category.saving}>
                {Object.values(Category).map((type) => (
                  <option
                    key={type}
                    value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
              <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 '>
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
              className='block uppercase  text-xs font-bold mb-2'
              htmlFor='amount'>
              Amount
            </label>
            <input
              className='appearance-none block w-full focus:text-black bg-royalBlue border border-royalBlue rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-white'
              id='amount'
              name='amount'
              type='number'
              placeholder='150'
              value={formData.amount?.toString() || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* LOCATION */}
        <div className='flex flex-wrap gap-3'>
          <div className='w-full flex-1 mb-6 md:mb-0'>
            <label
              className='block uppercase tracking-wide  text-xs font-bold mb-2'
              htmlFor='location'>
              Location
            </label>
            <input
              className='appearance-none block w-full focus:text-black bg-royalBlue border border-royalBlue rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white'
              id='location'
              name='location'
              type='text'
              placeholder='St. Gallen'
              value={formData.location || ''}
              onChange={handleInputChange}
            />
          </div>

          {/* DATE */}
          <div className='w-full flex-1'>
            <label
              className='block uppercase tracking-wide text-xs font-bold mb-2'
              htmlFor='date'>
              Date
            </label>
            <input
              type='date'
              name='date'
              id='date'
              className='appearance-none block w-full focus:text-black bg-royalBlue border border-royalBlue rounded py-[11px] px-4 mb-3 leading-tight focus:outline-none focus:bg-white'
              placeholder='Select date'
              value={formData.date || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>
        {/* SUBMIT BUTTON */}
        <Button
          type='submit'
          variant='primary'
          className='font-bold w-full rounded px-4 py-2'
          disabled={loadingUpdate}>
          {loadingUpdate ? 'Updating...' : 'Update Transaction'}
        </Button>
      </form>
    </div>
  );
};

export default TransactionPage;
