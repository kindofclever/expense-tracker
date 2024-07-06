import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { MdLogout } from 'react-icons/md';
import toast from 'react-hot-toast';
import { useMutation, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';

import { LOGOUT } from '../../graphql/mutations/user.mutation';
import { GET_TRANSACTION_STATISTICS } from '../../graphql/queries/transaction.query';
import { GET_AUTHENTICATED_USER } from '../../graphql/queries/user.query';
import Cards from '../shared/custom/Cards';
import TransactionForm from '../shared/custom/TransactionForm';
import {
  TransactionStatisticsData,
  AuthUserData,
} from '../../interfaces/interfaces';
import SubHeader from '../shared/custom/SubHeader';
import CustomHelmet from '../shared/custom/CustomHelmet';

ChartJS.register(ArcElement, Tooltip, Legend);

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { data: transactionData } = useQuery<TransactionStatisticsData>(
    GET_TRANSACTION_STATISTICS
  );
  const { data: authUserData } = useQuery<AuthUserData>(GET_AUTHENTICATED_USER);

  const [logout, { loading, client }] = useMutation(LOGOUT);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      client.resetStore();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(t('homePage.unknownError'));
      }
    }
  };

  const options = {
    plugins: {
      legend: {
        labels: {
          color: '#EEF1EF', // tw css white
        },
      },
    },
  };

  const chartData = useMemo(() => {
    if (!transactionData?.categoryStatistics)
      return { labels: [], datasets: [] };

    const categories = transactionData.categoryStatistics.map(
      (stat) => stat.category
    );
    const totalAmounts = transactionData.categoryStatistics.map(
      (stat) => stat.totalAmount
    );

    const backgroundColors: string[] = [];
    const borderColors: string[] = [];

    categories.forEach((category) => {
      if (category === 'saving') {
        backgroundColors.push('rgba(73, 109, 219)'); // royalBlue
        borderColors.push('rgba(73, 109, 219)'); // royalBlue
      } else if (category === 'expense') {
        backgroundColors.push('rgba(238, 132, 52)'); // orangeWheel
        borderColors.push('rgba(238, 132, 52)'); // orangeWheel
      } else if (category === 'investment') {
        backgroundColors.push('rgba(162, 0, 33)'); // madder
        borderColors.push('rgba(162, 0, 33)'); // madder
      }
    });

    return {
      labels: categories.map((category) =>
        t(`homePage.categories.${category}`)
      ),
      datasets: [
        {
          label: 'CHF',
          data: totalAmounts,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
        },
      ],
    };
  }, [transactionData, t]);

  return (
    <>
      <CustomHelmet
        title={t('homePage.title')}
        description={t('homePage.description')}
        keywords={t('homePage.keywords')}
        canonical='/home'
      />
      <div className='flex flex-col gap-6 items-center max-w-7xl mx-auto z-20 relative justify-center'>
        <div className='flex flex-col md:flex-row items-center gap-y-7 md:gap-y-0 md:gap-x-4'>
          <SubHeader
            text={`${t('homePage.hello')} ${authUserData?.authUser.username}!`}
          />
          {authUserData?.authUser?.profilePicture && (
            <img
              src={authUserData.authUser.profilePicture}
              className='w-11 h-11 rounded-full border cursor-pointer'
              alt={t('homePage.avatarAltText')}
              width={120}
              height={120}
              onClick={() => navigate(`/users/${authUserData.authUser.id}`)}
            />
          )}
          {!loading && (
            <MdLogout
              className='w-5 h-5 cursor-pointer'
              onClick={handleLogout}
              data-testid='logout-icon'
              title={t('homePage.logout')}
            />
          )}
          {loading && (
            <div className='w-6 h-6 border-t-2 border-b-2 rounded-full animate-spin'></div>
          )}
        </div>

        <div className='flex flex-wrap w-full justify-between items-start gap-6 min-h-[40vh]'>
          {transactionData?.categoryStatistics &&
            transactionData.categoryStatistics.length > 0 && (
              <div className='h-[330px] w-[330px] md:h-[360px] md:w-[360px]'>
                <Pie
                  data={chartData}
                  options={options}
                />
              </div>
            )}
          <div className='w-full md:w-1/2'>
            <TransactionForm />
          </div>
        </div>
        <Cards />
      </div>
    </>
  );
};

export default HomePage;
