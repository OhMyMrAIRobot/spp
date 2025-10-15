import { gql } from '@apollo/client'

export const GET_PROJECTS_QUERY = gql`
	query GetProjects {
		projects {
			id
			title
			description
			createdAt
			members {
				id
				username
				role
			}
			taskCounts {
				TODO
				IN_PROGRESS
				DONE
			}
		}
	}
`

export const GET_PROJECT_BY_ID_QUERY = gql`
	query GetProject($id: ID!) {
		project(id: $id) {
			id
			title
			description
			createdAt
			members {
				id
				username
				role
			}
			taskCounts {
				TODO
				IN_PROGRESS
				DONE
			}
		}
	}
`

export const CREATE_PROJECT_MUTATION = gql`
	mutation CreateProject($input: CreateProjectInput!) {
		createProject(input: $input) {
			id
			title
			description
			createdAt
			members {
				id
				username
				role
			}
			taskCounts {
				TODO
				IN_PROGRESS
				DONE
			}
		}
	}
`

export const UPDATE_PROJECT_MUTATION = gql`
	mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {
		updateProject(id: $id, input: $input) {
			id
			title
			description
			members {
				id
				username
				role
			}
			taskCounts {
				TODO
				IN_PROGRESS
				DONE
			}
		}
	}
`

export const DELETE_PROJECT_MUTATION = gql`
	mutation DeleteProject($id: ID!) {
		deleteProject(id: $id)
	}
`
