const tagTypeDef = `#graphql
type Tag {
  id: ID!
  name: String!
}

type CustomTag {
  id: ID!
  name: String!
  searchTerm: String!
}

extend type Query {
  tags: [Tag!]
  userTags(userId: ID!): [Tag!]
  customTags: [CustomTag!]
}

extend type Mutation {
  createTag(name: String!): Tag!
  addUserTag(userId: ID!, tagId: ID!): User!
  createCustomTag(name: String!, searchTerm: String!): CustomTag!
}
`;

export default tagTypeDef;
