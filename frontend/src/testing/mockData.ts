// mockData.js
import { LOGIN, LOGOUT } from '../graphql/mutations/user.mutation';
import { GET_TRANSACTION_STATISTICS } from '../graphql/queries/transaction.query';
import { GET_AUTHENTICATED_USER } from '../graphql/queries/user.query';

export const loginMocks = [
  {
    request: {
      query: LOGIN,
      variables: {
        input: { username: 'testuser', password: 'password123' },
      },
    },
    result: {
      data: {
        login: {
          id: '1',
          name: 'testuser',
          username: 'testuser',
          __typename: 'User',
        },
      },
    },
  },
];

export const errorLoginMocks = [
  {
    request: {
      query: LOGIN,
      variables: {
        input: { username: 'testuser', password: 'wrongpassword' },
      },
    },
    error: new Error('Login failed'),
  },
];

export const transactionDataMock = {
  request: {
    query: GET_TRANSACTION_STATISTICS,
  },
  result: {
    data: {
      categoryStatistics: [
        { category: 'saving', totalAmount: 1000, __typename: "CategoryStatistics" },
        { category: 'expense', totalAmount: 500, __typename: "CategoryStatistics" },
        { category: 'investment', totalAmount: 2000, __typename: "CategoryStatistics" },
      ],
    },
  },
};

export const userMock = {
  request: {
    query: GET_AUTHENTICATED_USER,
  },
  result: {
    data: {
      authUser: {
        id: '1',
        username: 'testuser',
        profilePicture: 'https://example.com/avatar.jpg',
      },
    },
  },
};

export const logoutErrorMock = {
  request: {
    query: LOGOUT,
  },
  error: new Error('Logout failed'),
};

export const logoutMock = {
  request: {
    query: LOGOUT,
  },
  result: {
    data: {
      logout: {
        message: "Logged out successfully",
        __typename: "LogoutResponse"
      }
    }
  },
};

// Include the mock responses for the queries and mutations
export const mocks = [transactionDataMock, userMock, logoutMock, userMock, transactionDataMock];
