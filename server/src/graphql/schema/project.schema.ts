import { gql } from 'graphql-tag';

export const projectTypeDefs = gql`
  type TaskCounts {
    TODO: Int!
    IN_PROGRESS: Int!
    DONE: Int!
  }

  type Project {
    id: ID!
    title: String!
    description: String!
    members: [User!]!
    createdAt: DateTime!
    taskCounts: TaskCounts!
  }

  input CreateProjectInput {
    title: String!
    description: String!
    members: [ID!]
  }

  input UpdateProjectInput {
    title: String
    description: String
    members: [ID!]
  }

  extend type Query {
    projects: [Project!]!
    project(id: ID!): Project!
  }

  extend type Mutation {
    createProject(input: CreateProjectInput!): Project!
    updateProject(id: ID!, input: UpdateProjectInput!): Project!
    deleteProject(id: ID!): Boolean!
  }
`;
