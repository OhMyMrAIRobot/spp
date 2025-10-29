/* eslint-disable @typescript-eslint/no-explicit-any */
export const extractGrpcError = (
	err: any,
	placeholder: string
): { message: string; errors?: any[] } => {
	if (err?.message) return { message: err.message }
	if (err?.statusMessage) return { message: err.statusMessage }
	return { message: placeholder }
}
