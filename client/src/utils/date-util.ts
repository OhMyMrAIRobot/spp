export const dateUtils = {
	format: (date: string | Date): string => {
		return new Date(date)
			.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
			})
			.toUpperCase()
	},
}
