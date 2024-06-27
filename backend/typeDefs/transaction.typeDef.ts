export const transactionTypeDef = `#graphql
type Transaction {
  _id: ID!
  userId: ID!
  description: String!
  paymentType: PaymentType!
  category: String!
  amount: Float!
  location: String!
  date: String!
}

enum PaymentType {
  cash,
  debit,
  credit,
  twint,
}`