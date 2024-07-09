const userTypeDef = `#graphql
type User {
  id: ID!
  username: String!
  name: String!
  password: String!
  profilePicture: String!
  gender: Gender!
  transactions: [Transaction!]!
  tags: [Tag!]!
}

enum Gender {
  male
  female
  diverse
}

type Transaction {
  id: ID!
  description: String!
  paymentType: PaymentType!
  category: Category!
  amount: Float!
  location: String!
  date: String!
}

enum PaymentType {
  cash
  debit
  credit
  twint
}

type Query {
  users: [User!]
  user(userId: ID!): User
  authUser: User
}

type Mutation {
  signUp(input: SignUpInput!): User!
  login(input: LoginInput!): User!
  logout: LogoutResponse!
}

input SignUpInput {
  username: String!
  name: String!
  password: String!
  gender: Gender!
}

input LoginInput {
  username: String!
  password: String!
}

type LogoutResponse {
  message: String!
}
`;

export default userTypeDef;
