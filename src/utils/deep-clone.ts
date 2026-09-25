// deepClone — a structural copy where nothing is shared with the original.
// The interview value is in the cases people forget: Dates, arrays, and circular
// references. On the job board it backs "reset filters to their last saved state".

export function deepClone<T>(value: T, seen: WeakMap<object, unknown> = new WeakMap()): T {
  // TODO 1: Primitives have nothing to clone — return them as they are. `typeof null === 'object'`, so check for null first.
  // TODO 2: A Date needs its own branch: `new Date(value.getTime())`. A generic object copy turns a Date into `{}`.
  // TODO 3: Cycles: the `seen` WeakMap remembers original → copy. Check it before you copy anything, and record the new copy BEFORE you copy its children — otherwise a cycle still recurses forever.
  // TODO 4: Arrays are objects too, but copying one key by key gives you an object with numeric keys. Branch on `Array.isArray` first.
  throw new Error('Not implemented')
}
