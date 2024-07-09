const tagTypeDef = `#graphql
type Tag {
  id: ID!
  name: String!
}

extend type Query {
  tags: [Tag!]
  userTags(userId: ID!): [Tag!]
}

extend type Mutation {
  createTag(name: String!): Tag!
  addUserTag(userId: ID!, tagId: ID!): User!
}
`;

export default tagTypeDef;

