const transactionTypeDef = `#graphql
type Transaction {
  id: ID!
  userId: ID!
  description: String!
  paymentType: PaymentType!
  category: Category!
  amount: Float!
  location: String!
  date: String!
  user: User!
}

enum PaymentType {
  cash
  debit
  credit
  twint
}

enum Category {
  investment
  saving
  expense
}

type Query {
  transactions: [Transaction!]
  transaction(transactionId: ID!): Transaction
  categoryStatistics: [CategoryStatistics!]
}

type Mutation {
  createTransaction(input: CreateTransactionInput!): Transaction!
  updateTransaction(input: UpdateTransactionInput!): Transaction!
  deleteTransaction(transactionId: ID!): Transaction!
}

type CategoryStatistics {
  category: String!
  totalAmount: Float!
}

input CreateTransactionInput {
  description: String!
  paymentType: PaymentType!
  category: Category!
  amount: Float!
  date: String!
  location: String!
}

input UpdateTransactionInput {
  transactionId: ID!
  description: String
  paymentType: PaymentType
  category: Category
  amount: Float
  location: String
  date: String
}

`

export default transactionTypeDef