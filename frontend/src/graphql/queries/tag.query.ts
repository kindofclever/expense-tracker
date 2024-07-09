import { gql } from "@apollo/client";

export const GET_CUSTOM_TAGS = gql`
  query GetCustomTags {
    customTags {
      id
      name
      searchTerm
    }
  }
`;