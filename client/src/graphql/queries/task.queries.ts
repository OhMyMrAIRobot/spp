import { gql } from '@apollo/client'

export const GET_TASKS_BY_PROJECT_QUERY = gql`
	query GetTasksByProject($projectId: ID!) {
		tasksByProject(projectId: $projectId) {
			id
			title
			description
			status
			assignee
			dueDate
			createdAt
			projectId
			user {
				id
				username
				role
			}
			attachments {
				id
				originalName
				mimeType
				size
				createdAt
			}
		}
	}
`

export const CREATE_TASK_MUTATION = gql`
	mutation CreateTask($input: CreateTaskInput!) {
		createTask(input: $input) {
			id
			title
			description
			status
			assignee
			dueDate
			createdAt
			projectId
			user {
				id
				username
				role
			}
			attachments {
				id
				originalName
				size
				createdAt
			}
		}
	}
`

export const UPDATE_TASK_MUTATION = gql`
	mutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {
		updateTask(id: $id, input: $input) {
			id
			title
			description
			status
			assignee
			dueDate
			createdAt
			projectId
			user {
				id
				username
				role
			}
			attachments {
				id
				originalName
				size
				createdAt
			}
		}
	}
`

export const DELETE_TASK_MUTATION = gql`
	mutation DeleteTask($id: ID!) {
		deleteTask(id: $id)
	}
`
