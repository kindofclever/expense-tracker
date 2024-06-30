import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { MdLogout } from 'react-icons/md';
import toast from 'react-hot-toast';
import { useMutation, useQuery } from '@apollo/client';

import { LOGOUT } from '../../graphql/mutations/user.mutation';
import { GET_TRANSACTION_STATISTICS } from '../../graphql/queries/transaction.query';
import { GET_AUTHENTICATED_USER } from '../../graphql/queries/user.query';
import Cards from '../shared/custom/Cards';
import TransactionForm from '../shared/custom/TransactionForm';
import {
  TransactionStatisticsData,
  AuthUserData,
} from '../../interfaces/interfaces';

ChartJS.register(ArcElement, Tooltip, Legend);

const HomePage: React.FC = () => {
  const { data: transactionData } = useQuery<TransactionStatisticsData>(
    GET_TRANSACTION_STATISTICS
  );
  const { data: authUserData } = useQuery<AuthUserData>(GET_AUTHENTICATED_USER);

  const [logout, { loading, client }] = useMutation(LOGOUT, {
    refetchQueries: ['GetAuthenticatedUser'],
  });

  const [chartData, setChartData] = useState({
    labels: [] as string[],
    datasets: [
      {
        label: '$',
        data: [] as number[],
        backgroundColor: [] as string[],
        borderColor: [] as string[],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    if (transactionData?.categoryStatistics) {
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
          backgroundColors.push('rgba(75, 192, 192)');
          borderColors.push('rgba(75, 192, 192)');
        } else if (category === 'expense') {
          backgroundColors.push('rgba(255, 99, 132)');
          borderColors.push('rgba(255, 99, 132)');
        } else if (category === 'investment') {
          backgroundColors.push('rgba(54, 162, 235)');
          borderColors.push('rgba(54, 162, 235)');
        }
      });

      setChartData((prev) => ({
        labels: categories,
        datasets: [
          {
            ...prev.datasets[0],
            data: totalAmounts,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
          },
        ],
      }));
    }
  }, [transactionData]);

  const handleLogout = async () => {
    try {
      await logout();
      client.resetStore();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unknown error occurred');
      }
    }
  };

  return (
    <div className='flex flex-col gap-6 items-center max-w-7xl mx-auto z-20 relative justify-center'>
      <div className='flex items-center'>
        <p className='md:text-4xl text-2xl lg:text-4xl font-bold text-center relative z-50 mb-4 mr-4 bg-gradient-to-r from-pink-600 via-indigo-500 to-pink-400 inline-block text-transparent bg-clip-text'>
          Spend wisely, track wisely
        </p>
        {authUserData?.authUser?.profilePicture && (
          <img
            src={authUserData.authUser.profilePicture}
            className='w-11 h-11 rounded-full border cursor-pointer'
            alt='Avatar'
          />
        )}
        {!loading && (
          <MdLogout
            className='mx-2 w-5 h-5 cursor-pointer'
            onClick={handleLogout}
          />
        )}
        {loading && (
          <div className='w-6 h-6 border-t-2 border-b-2 mx-2 rounded-full animate-spin'></div>
        )}
      </div>
      <div className='flex flex-wrap w-full justify-center items-center gap-6'>
        {transactionData?.categoryStatistics &&
          transactionData.categoryStatistics.length > 0 && (
            <div className='h-[330px] w-[330px] md:h-[360px] md:w-[360px]'>
              <Pie data={chartData} />
            </div>
          )}
        <TransactionForm />
      </div>
      <Cards />
    </div>
  );
};

export default HomePage;
