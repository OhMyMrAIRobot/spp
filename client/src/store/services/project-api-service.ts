import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { ApiResponse } from '../../types/api-response'
import type { CreateProjectData } from '../../types/projects/create-project-data'
import type { IProjectWithStats } from '../../types/projects/project-with-stats'

const SERVER_URL = import.meta.env.VITE_API_URL

export const projectApi = createApi({
	reducerPath: 'ProjectApi',
	baseQuery: fetchBaseQuery({ baseUrl: SERVER_URL }),
	tagTypes: ['Projects'],
	endpoints: builder => ({
		getProjects: builder.query<IProjectWithStats[], void>({
			query: () => '/projects',
			providesTags: result =>
				result
					? [
							...result.map(({ id }) => ({ type: 'Projects' as const, id })),
							{ type: 'Projects', id: 'LIST' },
					  ]
					: [{ type: 'Projects', id: 'LIST' }],
			transformResponse: (response: ApiResponse<IProjectWithStats[]>) =>
				response.data ?? [],
		}),

		getProjectById: builder.query<IProjectWithStats | undefined, string>({
			query: id => `/projects/${id}`,
			providesTags: (_, __, id) => [{ type: 'Projects', id }],
			transformResponse: (response: ApiResponse<IProjectWithStats>) =>
				response.data ?? undefined,
		}),

		createProject: builder.mutation<
			IProjectWithStats | null,
			CreateProjectData
		>({
			query: body => ({
				url: '/projects',
				method: 'POST',
				body,
			}),
			transformResponse: (response: ApiResponse<IProjectWithStats>) =>
				response.data ?? null,
			async onQueryStarted(body, { dispatch, queryFulfilled }) {
				const tempId = `temp-${Date.now()}`
				const tempProject: IProjectWithStats = {
					id: tempId,
					title: body.title,
					description: body.description,
					members: body.members,
					createdAt: new Date().toISOString(),
					taskCounts: { TODO: 0, IN_PROGRESS: 0, DONE: 0 },
				}

				const patchResult = dispatch(
					projectApi.util.updateQueryData('getProjects', undefined, draft => {
						draft.push(tempProject)
					})
				)

				try {
					const { data: realProject } = await queryFulfilled

					if (realProject) {
						dispatch(
							projectApi.util.updateQueryData(
								'getProjects',
								undefined,
								draft => {
									const index = draft.findIndex(p => p.id === tempId)
									if (index !== -1) draft[index] = realProject
								}
							)
						)
					} else {
						patchResult.undo()
					}
				} catch {
					patchResult.undo()
				}
			},
		}),
	}),
})

export const {
	useGetProjectsQuery,
	useGetProjectByIdQuery,
	useCreateProjectMutation,
} = projectApi
