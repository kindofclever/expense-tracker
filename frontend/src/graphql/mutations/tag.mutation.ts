import { gql } from '@apollo/client';

export const CREATE_CUSTOM_TAG = gql`
  mutation CreateCustomTag($name: String!, $searchTerm: String!) {
    createCustomTag(name: $name, searchTerm: $searchTerm) {
      id
      name
      searchTerm
    }
  }
`;
