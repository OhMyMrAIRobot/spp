import { gql } from 'graphql-tag';

export const userTypeDefs = gql`
  enum UserRole {
    ADMIN
    MEMBER
  }

  type User {
    id: ID!
    username: String!
    role: UserRole!
  }

  extend type Query {
    users: [User!]!
  }
`;
