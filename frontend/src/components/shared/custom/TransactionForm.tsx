import { useState, FormEvent, ChangeEvent } from 'react';
import { useMutation } from '@apollo/client';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import { Category, PaymentType } from '../../../interfaces/interfaces';
import { CREATE_TRANSACTION } from '../../../graphql/mutations/transaction.mutation';
import Button from './Button';

const TransactionForm: React.FC = () => {
  const { t } = useTranslation();

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
      setSelectedDate(today);
      toast.success(t('transactionForm.transactionSuccess'));
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(t('transactionForm.unknownError'));
      }
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'amount' && parseFloat(value) < 0) {
      toast.error(t('transactionForm.negativeAmountError'));
      return;
    }
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  return (
    <form
      className='w-full flex flex-col gap-5'
      onSubmit={handleSubmit}>
      {/* TRANSACTION */}
      <div className='flex flex-wrap'>
        <div className='w-full'>
          <label
            className='block uppercase tracking-wide text-xs font-bold mb-2'
            htmlFor='description'>
            {t('transactionForm.transactionDescriptionLabel')}
          </label>
          <input
            className='appearance-none block w-full focus:text-black bg-royalBlue border border-royalBlue rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-white'
            id='description'
            name='description'
            type='text'
            placeholder={t('transactionForm.transactionDescriptionPlaceholder')}
          />
        </div>
      </div>
      {/* PAYMENT TYPE */}
      <div className='flex flex-wrap gap-3'>
        <div className='w-full flex-1 mb-6 md:mb-0'>
          <label
            className='block uppercase tracking-wide text-xs font-bold mb-2'
            htmlFor='paymentType'>
            {t('transactionForm.paymentTypeLabel')}
          </label>
          <div className='relative'>
            <select
              className='block appearance-none w-full focus:text-black bg-royalBlue border border-royalBlue py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-glaucouse'
              id='paymentType'
              name='paymentType'>
              {Object.values(PaymentType).map((type) => (
                <option
                  key={type}
                  value={type}>
                  {t(`transactionForm.paymentType.${type}`)}
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
            className='block uppercase tracking-wide text-xs font-bold mb-2'
            htmlFor='category'>
            {t('transactionForm.categoryLabel')}
          </label>
          <div className='relative'>
            <select
              className='block appearance-none w-full focus:text-black bg-royalBlue border border-royalBlue py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-white'
              id='category'
              name='category'>
              {Object.values(Category).map((type) => (
                <option
                  key={type}
                  value={type}>
                  {t(`transactionForm.category.${type}`)}
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
            className='block uppercase text-xs font-bold mb-2'
            htmlFor='amount'>
            {t('transactionForm.amountLabel')}
          </label>
          <input
            className='appearance-none block w-full focus:text-black bg-royalBlue border border-royalBlue rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-white'
            id='amount'
            name='amount'
            type='number'
            placeholder='150'
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* LOCATION */}
      <div className='flex flex-wrap gap-3'>
        <div className='w-full flex-1 mb-6 md:mb-0'>
          <label
            className='block uppercase tracking-wide text-xs font-bold mb-2'
            htmlFor='location'>
            {t('transactionForm.locationLabel')}
          </label>
          <input
            className='appearance-none block w-full focus:text-black bg-royalBlue border border-royalBlue rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white'
            id='location'
            name='location'
            type='text'
            placeholder={t('transactionForm.locationPlaceholder')}
          />
        </div>

        {/* DATE */}
        <div className='w-full flex-1'>
          <label
            className='block uppercase tracking-wide text-xs font-bold mb-2'
            htmlFor='date'>
            {t('transactionForm.dateLabel')}
          </label>
          <input
            value={selectedDate}
            onChange={handleDateChange}
            type='date'
            name='date'
            id='date'
            className='appearance-none focus:text-black block w-full bg-royalBlue border border-royalBlue rounded py-[11px] px-4 mb-3 leading-tight focus:outline-none focus:bg-white'
            placeholder={t('transactionForm.selectDate')}
          />
        </div>
      </div>
      {/* SUBMIT BUTTON */}
      <Button
        type='submit'
        variant='primary'
        disabled={loading}>
        {loading
          ? t('transactionForm.loading')
          : t('transactionForm.addTransaction')}
      </Button>
    </form>
  );
};

export default TransactionForm;
