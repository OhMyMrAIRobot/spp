import { createApi } from '@reduxjs/toolkit/query/react'
import {
	grpcCreateProject,
	grpcDeleteProject,
	grpcGetAllProjects,
	grpcGetProjectById,
	grpcUpdateProject,
} from '../../grpc/clients/project-client'
import { Project } from '../../grpc/generated/project'
import { extractGrpcError } from '../../grpc/utils/extract-grpc-error'
import type { CreateProjectData } from '../../types/projects/create-project-data'

export const projectApi = createApi({
	reducerPath: 'ProjectApi',
	baseQuery: async () => ({ data: undefined }),
	tagTypes: ['Projects'],

	endpoints: builder => ({
		getProjects: builder.query<Project[], void>({
			queryFn: async () => {
				try {
					const data = await grpcGetAllProjects()
					return { data: data.projects }
				} catch (err) {
					return { error: extractGrpcError(err, 'Failed to fetch projects') }
				}
			},
			providesTags: result =>
				result
					? [
							...result.map(({ id }) => ({
								type: 'Projects' as const,
								id,
							})),
							{ type: 'Projects', id: 'LIST' },
					  ]
					: [{ type: 'Projects', id: 'LIST' }],
		}),

		getProjectById: builder.query<Project | undefined, string>({
			queryFn: async id => {
				try {
					const data = await grpcGetProjectById(id)
					return { data: data.project }
				} catch (err) {
					return { error: extractGrpcError(err, 'Failed to fetch project') }
				}
			},
			providesTags: (_, __, id) => [{ type: 'Projects', id }],
		}),

		createProject: builder.mutation<Project | undefined, CreateProjectData>({
			queryFn: async body => {
				try {
					const data = await grpcCreateProject(body)
					return { data: data.project }
				} catch (err) {
					return { error: extractGrpcError(err, 'Failed to create project') }
				}
			},
			invalidatesTags: [{ type: 'Projects', id: 'LIST' }],
		}),

		updateProject: builder.mutation<
			Project | undefined,
			{ id: string; changes: Partial<CreateProjectData> }
		>({
			queryFn: async ({ id, changes }) => {
				try {
					const data = await grpcUpdateProject(id, changes)
					return { data: data.project }
				} catch (err) {
					return { error: extractGrpcError(err, 'Failed to update project') }
				}
			},
			invalidatesTags: (_, __, { id }) => [{ type: 'Projects', id }],
		}),

		deleteProject: builder.mutation<{ success: boolean }, string>({
			queryFn: async id => {
				try {
					await grpcDeleteProject(id)
					return { data: { success: true } }
				} catch (err) {
					return { error: extractGrpcError(err, 'Failed to delete project') }
				}
			},
			invalidatesTags: (_, __, id) => [
				{ type: 'Projects', id },
				{ type: 'Projects', id: 'LIST' },
			],
		}),
	}),
})

export const {
	useGetProjectsQuery,
	useGetProjectByIdQuery,
	useCreateProjectMutation,
	useUpdateProjectMutation,
	useDeleteProjectMutation,
} = projectApi
