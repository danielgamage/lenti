/** Helper
 * @ignore
 */
export const clamp = (value: number, min: number, max: number) =>  Math.min(Math.max(value, min), max)

/** Helper
 * @ignore
 */
export const remap = (value: number, domain: [number, number], range: [number, number]) =>  range[0] + (value - domain[0]) * (range[1] - range[0]) / (domain[1] - domain[0])
