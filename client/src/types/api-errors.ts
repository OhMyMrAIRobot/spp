export type ApiError = {
	status: number
	data: {
		message?: string
		errors?: { path: string; message: string }[]
	}
}
