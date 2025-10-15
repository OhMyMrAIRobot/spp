import { gql } from 'graphql-tag';

export const taskTypeDefs = gql`
  enum TaskStatus {
    TODO
    IN_PROGRESS
    DONE
  }

  type Task {
    id: ID!
    title: String!
    description: String!
    status: TaskStatus!
    assignee: ID!
    user: User!
    projectId: ID!
    project: Project!
    dueDate: DateTime
    createdAt: DateTime!
    attachments: [Attachment!]!
  }

  input CreateTaskInput {
    title: String!
    description: String!
    projectId: ID!
    status: TaskStatus
    dueDate: DateTime
  }

  input UpdateTaskInput {
    title: String
    description: String
    status: TaskStatus
    dueDate: DateTime
  }

  extend type Query {
    tasks: [Task!]!
    task(id: ID!): Task!
    tasksByProject(projectId: ID!): [Task!]!
  }

  extend type Mutation {
    createTask(input: CreateTaskInput!): Task!
    updateTask(id: ID!, input: UpdateTaskInput!): Task!
    deleteTask(id: ID!): Boolean!
  }
`;
