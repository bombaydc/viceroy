import xss from 'xss';
import validator from 'validator';

/**
 * Sanitize strings to prevent XSS
 */
export function sanitizeString(value: string): string {
  return xss(value.trim());
}

/**
 * Sanitize email address (removes invalid characters)
 */
export function sanitizeEmail(input: string): string {
  return validator.normalizeEmail(input.trim()) || '';
}

/**
 * Sanitize URL (trims and escapes)
 */
export function sanitizeUrl(input: string): string {
  const url = input.trim();
  return validator.isURL(url) ? url : '';
}

/**
 * Sanitize integer (removes non-digit characters)
 */
export function sanitizeInt(input: string | number): number {
  const num = validator.toInt(input.toString());
  return Number.isFinite(num) ? num : 0;
}

/**
 * Sanitize float (removes invalid float characters)
 */
export function sanitizeFloat(input: string | number): number {
  const num = validator.toFloat(input.toString());
  return Number.isFinite(num) ? num : 0;
}
/**
 * Sanitize an entire object (deep clone + sanitize strings only)
 */
export function sanitizeObject<T extends object>(obj: T): T {
  const result = {} as T;

  for (const key in obj) {
    const val = obj[key];
    
    if (typeof val === 'string') {
      result[key] = sanitizeString(val) as T[typeof key];
    } else if (typeof val === 'object' && val !== null) {
      result[key] = sanitizeObject(val) as T[typeof key];
    } else {
      result[key] = val;
    }
  }

  return result;
}
