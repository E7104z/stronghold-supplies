import type { Timestamp } from 'firebase/firestore'

/**
 * Safely converts a Firestore Timestamp, Date, string, or number to a JS Date.
 * Returns null if the value is falsy or results in an invalid date.
 */
export function toDate(val: unknown): Date | null {
  if (!val) return null
  if (val instanceof Date) return isNaN(val.getTime()) ? null : val
  // Firestore Timestamp
  if (typeof val === 'object' && typeof (val as Timestamp).toDate === 'function') {
    return (val as Timestamp).toDate()
  }
  const d = new Date(val as string | number)
  return isNaN(d.getTime()) ? null : d
}

/** Format a Firestore timestamp safely, returning fallback if invalid. */
export function fmtDate(val: unknown, fmt: (d: Date) => string, fallback = '—'): string {
  const d = toDate(val)
  return d ? fmt(d) : fallback
}
