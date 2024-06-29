const userTypeDef = `#graphql
type User {
  id: ID!
  username: String!
  name: String!
  password: String!
  profilePicture: String!
  gender: Gender!
  transactions: [Transaction!]!
}

enum Gender {
  male
  female
  diverse
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
}`

export default userTypeDef