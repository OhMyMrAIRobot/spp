import { gql } from 'graphql-tag';

export const attachmentTypeDefs = gql`
  type Attachment {
    id: ID!
    taskId: ID!
    projectId: ID!
    originalName: String!
    mimeType: String!
    size: Int!
    uploadedBy: ID!
    createdAt: DateTime!
  }

  extend type Query {
    attachmentsByTask(taskId: ID!): [Attachment!]!
    attachment(id: ID!): Attachment!
  }

  extend type Mutation {
    uploadAttachments(taskId: ID!, files: [Upload!]!): [Attachment!]!
    deleteAttachment(id: ID!): Boolean!
  }
`;
