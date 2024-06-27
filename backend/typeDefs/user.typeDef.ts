const userTypeDef = `#graphql
type User {
  _id: ID!
  username: String!
  name: String!
  password: String!
  profilePicture: String!
  gender: Gender!
}

enum Gender {
  male
  female
  diverse
}

type Query {
  users: [User!]
  authorisedUser: User
  user(userId: ID!): User
}

type Mutation {
  signUp(input: SignUpInput!): User
  login(input: LoginInput!): User
  logout: LogoutResponse
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
  status: String!
  message: String
}`

export default userTypeDef