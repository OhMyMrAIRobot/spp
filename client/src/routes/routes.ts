export const ROUTES = {
	HOME: '/',
	PROJECTS: '/projects',
	PROJECT_DETAILS: '/projects/:id',
	PROFILE: '/profile',
	NOT_DEFINED: '*',
} as const

export type AppRoutes = keyof typeof ROUTES
