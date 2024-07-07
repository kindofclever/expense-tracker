import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import SubHeader from '../shared/custom/SubHeader';
import { GET_AUTHENTICATED_USER } from '../../graphql/queries/user.query';
import {
  DELETE_ALL_TRANSACTIONS,
  GET_TRANSACTION_STATISTICS,
  GET_TRANSACTIONS,
} from '../../graphql/queries/transaction.query';
import ConfirmationDialog from '../shared/custom/ConfirmationDialog';
import Button from '../shared/custom/Button';
import CustomHelmet from '../shared/custom/CustomHelmet';
import i18next from 'i18next';

const UserPage: React.FC = () => {
  const { t } = useTranslation();
  const {
    loading: authLoading,
    data: authData,
    error: authError,
  } = useQuery(GET_AUTHENTICATED_USER);
  const {
    loading: transactionsLoading,
    data: transactionsData,
    error: transactionsError,
  } = useQuery(GET_TRANSACTIONS, {
    variables: { offset: 0, limit: 1, filter: '' },
  });
  const [isDialogOpen, setDialogOpen] = useState(false);

  const [deleteAllTransactions] = useMutation(DELETE_ALL_TRANSACTIONS, {
    onCompleted: (data) => {
      if (data.deleteAllTransactions.success) {
        toast.success(t('userPage.deleteSuccess'));
        handleClose();
      } else {
        toast.error(
          data.deleteAllTransactions.message || t('userPage.deleteFailed')
        );
      }
    },
    onError: (error) => {
      toast.error(error.message || t('userPage.deleteFailed'));
    },
    refetchQueries: [
      { query: GET_TRANSACTION_STATISTICS },
      {
        query: GET_TRANSACTIONS,
        variables: { offset: 0, limit: 6, filter: '' },
      },
    ],
  });

  if (authLoading || transactionsLoading) return <p>{t('userPage.loading')}</p>;
  if (authError || transactionsError)
    return (
      <p>
        {t('userPage.error', {
          message: authError?.message || transactionsError?.message,
        })}
      </p>
    );

  const authUser = authData?.authUser;
  const transactions = transactionsData?.transactions?.transactions;

  if (!authUser) return <p>{t('userPage.notLoggedIn')}</p>;

  const handleDeleteAll = () => {
    deleteAllTransactions({ variables: { userId: authUser.id } });
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const changeLanguage = (language: string) => {
    console.log('change lang clicked');
    i18next.changeLanguage(language);
  };

  return (
    <>
      <CustomHelmet
        title={t('userPage.profilePageTitle')}
        description={t('userPage.profilePageDescription')}
        keywords={t('userPage.profilePageKeywords')}
        canonical={`/users/${authUser.id}`}
      />
      <div className='min-h-screen flex flex-col justify-start items-center'>
        <div className='flex items-center gap-x-5 mb-5'>
          <SubHeader
            text={t('userPage.welcome', { username: authUser.username })}
          />
          <img
            src={authUser.profilePicture}
            alt={`${authUser.username}'s profile`}
            width={120}
            height={120}
          />
        </div>
        <div className='flex items-center gap-x-5 mb-5'>
          <p>{t('userPage.switchLanguage')}</p>
          <Button
            onClick={() => changeLanguage('en')}
            variant='primary'>
            {t('userPage.english')}
          </Button>
          <Button
            onClick={() => changeLanguage('de')}
            variant='primary'>
            {t('userPage.german')}
          </Button>
        </div>
        {transactions && transactions.length > 0 && (
          <div className='flex justify-start items-center gap-x-5'>
            <p>{t('userPage.deleteMessage')}</p>
            <Button
              onClick={() => setDialogOpen(true)}
              variant='danger'>
              {t('userPage.deleteButton')}
            </Button>
          </div>
        )}
        <ConfirmationDialog
          isOpen={isDialogOpen}
          onClose={handleClose}
          onConfirm={handleDeleteAll}
          title={t('userPage.dialogTitle')}
          message={t('userPage.dialogMessage')}
        />
      </div>
    </>
  );
};

export default UserPage;
