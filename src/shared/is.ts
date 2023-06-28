export const toTypeString = (val: unknown): string => Object.prototype.toString.call(val)

export const isObject = (value: unknown): value is Record<any, any> =>
  value !== null && typeof value === 'object'

export const isFunction = (value: unknown): value is (...args: any) => any =>
  typeof value === 'function'

export const isString = (value: unknown): value is string => typeof value === 'string'
export const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean'
export const isNumber = (value: unknown): value is number => typeof value === 'number'
export const isUndef = (value: unknown): value is undefined => typeof value === 'undefined'
export const isDef = <T = any>(val?: T): val is T => typeof val !== 'undefined'
export const isDate = (val: unknown): val is Date => toTypeString(val) === '[object Date]'
