export function formatBytes(
	bytes: number,
	options?: {
		binary?: boolean
		decimals?: number
		locale?: string | string[]
	}
): string {
	if (!Number.isFinite(bytes)) return '—'

	const { binary = false, decimals = 1, locale } = options ?? {}

	const negative = bytes < 0
	const value = Math.abs(bytes)

	const base = binary ? 1024 : 1000
	const units = binary
		? ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
		: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

	if (value < 1) {
		const zero = new Intl.NumberFormat(locale).format(0)
		return `${negative ? '-' : ''}${zero} B`
	}

	const exponent = Math.min(
		Math.floor(Math.log(value) / Math.log(base)),
		units.length - 1
	)
	const sized = value / Math.pow(base, exponent)

	const nf = new Intl.NumberFormat(locale, {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
	})

	return `${negative ? '-' : ''}${nf.format(sized)} ${units[exponent]}`
}
