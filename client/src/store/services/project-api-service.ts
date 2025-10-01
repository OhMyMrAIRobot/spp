import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { ApiResponse } from '../../types/api-response'
import type { CreateProjectData } from '../../types/projects/create-project-data'
import type { IProjectWithStats } from '../../types/projects/project-with-stats'

const SERVER_URL = import.meta.env.VITE_API_URL

export const projectApi = createApi({
	reducerPath: 'ProjectApi',
	baseQuery: fetchBaseQuery({
		baseUrl: SERVER_URL,
		prepareHeaders: headers => {
			const token = localStorage.getItem('token')
			if (token) {
				headers.set('Authorization', `Bearer ${token}`)
			}
			return headers
		},
	}),
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

		updateProject: builder.mutation<
			IProjectWithStats | null,
			{ id: string; changes: Partial<CreateProjectData> }
		>({
			query: ({ id, changes }) => ({
				url: `/projects/${id}`,
				method: 'PATCH',
				body: changes,
			}),
			transformResponse: (response: ApiResponse<IProjectWithStats>) =>
				response.data ?? null,
			async onQueryStarted({ id, changes }, { dispatch, queryFulfilled }) {
				const patchList = dispatch(
					projectApi.util.updateQueryData('getProjects', undefined, draft => {
						const index = draft.findIndex(p => p.id === id)
						if (index !== -1) {
							draft[index] = { ...draft[index], ...changes }
						}
					})
				)

				const patchSingle = dispatch(
					projectApi.util.updateQueryData('getProjectById', id, draft => {
						if (draft) {
							Object.assign(draft, changes)
						}
					})
				)

				try {
					const { data: updated } = await queryFulfilled

					if (updated) {
						dispatch(
							projectApi.util.updateQueryData(
								'getProjects',
								undefined,
								draft => {
									const index = draft.findIndex(p => p.id === id)
									if (index !== -1) draft[index] = updated
								}
							)
						)

						dispatch(
							projectApi.util.updateQueryData('getProjectById', id, draft => {
								if (draft) {
									Object.assign(draft, updated)
								}
							})
						)
					} else {
						patchList.undo()
						patchSingle.undo()
					}
				} catch {
					patchList.undo()
					patchSingle.undo()
				}
			},
		}),

		deleteProject: builder.mutation<{ success: boolean }, string>({
			query: id => ({
				url: `/projects/${id}`,
				method: 'DELETE',
			}),
			async onQueryStarted(id, { dispatch, queryFulfilled }) {
				const patchList = dispatch(
					projectApi.util.updateQueryData('getProjects', undefined, draft => {
						const index = draft.findIndex(p => p.id === id)
						if (index !== -1) draft.splice(index, 1)
					})
				)

				const patchSingle = dispatch(
					projectApi.util.updateQueryData('getProjectById', id, () => {
						return undefined
					})
				)

				try {
					await queryFulfilled
				} catch {
					patchList.undo()
					patchSingle.undo()
				}
			},
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
