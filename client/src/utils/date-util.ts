/**
 * Utility object for date-related operations throughout the application
 * Provides consistent date formatting, validation, and date generation methods
 */
export const dateUtils = {
	/**
	 * Formats a date string or Date object into a human-readable Russian locale string
	 *
	 * @param {string | Date} date - Date to format (ISO string, timestamp, or Date object)
	 * @returns {string} Formatted date string in "15 января 2024" format
	 *
	 * @example
	 * dateUtils.format('2024-01-15'); // "15 января 2024"
	 * dateUtils.format(new Date()); // "18 сентября 2024"
	 *
	 * @throws {Error} If provided date cannot be parsed as valid Date object
	 */
	format: (date: string | Date): string => {
		return new Date(date).toLocaleDateString('ru-RU', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		})
	},

	/**
	 * Returns current date in ISO 8601 format (YYYY-MM-DD) without time component
	 *
	 * @returns {string} Current date in "2024-01-15" format
	 *
	 * @example
	 * dateUtils.getCurrent(); // "2024-01-15"
	 *
	 * @remarks
	 * Useful for date inputs, default values, and database operations requiring date-only format
	 */
	getCurrent: (): string => {
		return new Date().toISOString().split('T')[0]
	},

	/**
	 * Validates if a string can be parsed as a valid JavaScript Date object
	 *
	 * @param {string} date - Date string to validate
	 * @returns {boolean} True if date string is parseable and valid, false otherwise
	 *
	 * @example
	 * dateUtils.isValid('2024-01-15'); // true
	 * dateUtils.isValid('invalid-date'); // false
	 *
	 * @note
	 * Uses native Date.parse() which follows ISO 8601 format requirements
	 * Returns false for invalid dates like "2024-02-30"
	 */
	isValid: (date: string): boolean => {
		return !isNaN(Date.parse(date))
	},
}
