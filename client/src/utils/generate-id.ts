/**
 * Generates a unique identifier string combining timestamp and random components
 *
 * @returns {string} Unique identifier
 *
 * @example
 * generateId(); // "kf9z7m1x4c8d2e"
 */
export const generateId = (): string => {
	return Date.now().toString(36) + Math.random().toString(36).slice(2, 9)
}
