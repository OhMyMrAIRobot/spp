/**
 * Interface defining properties for SVG icon components
 *
 * @interface ISvgProps
 * @description Standardized props structure for reusable SVG icon components
 * to ensure consistent styling through CSS classes
 *
 * @property {string} className - CSS class names to apply styling to the SVG element.
 *                               Allows for size, color, and other visual customizations
 *                               through Tailwind CSS or custom classes
 *
 * @example
 * // Basic usage with Tailwind classes
 * <CalendarSvg className="w-5 h-5 text-gray-600" />
 *
 * @example
 * // Custom styling combination
 * <UserTickSvg className="size-6 text-green-500 hover:text-green-600 transition-colors" />
 */
export interface ISvgProps {
	className: string
}
