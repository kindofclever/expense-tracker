import { gql } from "@apollo/client";

export const GET_TRANSACTIONS = gql`
  query GetTransactions($offset: Int!, $limit: Int!) {
    transactions(offset: $offset, limit: $limit) {
      transactions {
        id
        description
        paymentType
        category
        amount
        location
        date
      }
      total
    }
  }
`;

export const GET_TRANSACTION = gql`
  query GetTransaction($id: ID!) {
    transaction(transactionId: $id) {
      id
      description
      paymentType
      category
      amount
      location
      date
      user {
        name
        username
        profilePicture
      }
    }
  }
`;

export const GET_TRANSACTION_STATISTICS = gql`
  query GetTransactionStatistics {
    categoryStatistics {
      category
      totalAmount
    }
  }
`;
