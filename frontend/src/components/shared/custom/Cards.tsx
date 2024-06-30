import { useQuery } from '@apollo/client';
import Card from './Card';
import { GET_TRANSACTIONS } from '../../../graphql/queries/transaction.query';
import {
  GET_AUTHENTICATED_USER,
  GET_USER_AND_TRANSACTIONS,
} from '../../../graphql/queries/user.query';
import { Transaction } from '../../../interfaces/interfaces';

const Cards: React.FC = () => {
  const { data: transactionsData, loading: transactionsLoading } =
    useQuery(GET_TRANSACTIONS);
  const { data: authUserData } = useQuery(GET_AUTHENTICATED_USER);

  const userId = authUserData?.authUser?._id;

  const { data: userAndTransactionsData } = useQuery(
    GET_USER_AND_TRANSACTIONS,
    {
      variables: {
        userId,
      },
      skip: !userId,
    }
  );

  console.log('userAndTransactions:', userAndTransactionsData);
  console.log('cards:', transactionsData);

  return (
    <div className='w-full px-10 min-h-[40vh]'>
      <p className='text-5xl font-bold text-center my-10'>History</p>
      <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-start mb-20'>
        {!transactionsLoading &&
          transactionsData?.transactions?.map((transaction: Transaction) => (
            <Card
              key={transaction.id}
              transaction={transaction}
              authUser={authUserData?.authUser}
              cardType={transaction.category}
            />
          ))}
      </div>
      {!transactionsLoading && transactionsData?.transactions?.length === 0 && (
        <p className='text-2xl font-bold text-center w-full'>
          No transaction history found.
        </p>
      )}
    </div>
  );
};

export default Cards;
