// #note deepClone — a structural copy where nothing is shared with the original.
// #note The interview value is in the cases people forget: Dates, arrays, and circular
// #note references. On the job board it backs "reset filters to their last saved state".

export function deepClone<T>(value: T, seen: WeakMap<object, unknown> = new WeakMap()): T {
  // #hint 1 Primitives have nothing to clone — return them as they are. `typeof null === 'object'`, so check for null first.
  // #hint 2 A Date needs its own branch: `new Date(value.getTime())`. A generic object copy turns a Date into `{}`.
  // #hint 3 Cycles: the `seen` WeakMap remembers original → copy. Check it before you copy anything, and record the new copy BEFORE you copy its children — otherwise a cycle still recurses forever.
  // #hint 4 Arrays are objects too, but copying one key by key gives you an object with numeric keys. Branch on `Array.isArray` first.
  // #region solution
  if (value === null || typeof value !== 'object') return value

  if (value instanceof Date) return new Date(value.getTime()) as T

  if (seen.has(value)) return seen.get(value) as T

  if (Array.isArray(value)) {
    const copy: unknown[] = []
    seen.set(value, copy)
    for (const entry of value) copy.push(deepClone(entry, seen))
    return copy as T
  }

  const copy: Record<string, unknown> = {}
  seen.set(value, copy)
  for (const [key, entry] of Object.entries(value)) {
    copy[key] = deepClone(entry, seen)
  }
  return copy as T
  // #endregion
}
