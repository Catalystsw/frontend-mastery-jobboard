/**
 * Mapped types — filter a type's keys down to the ones that match a condition
 *
 * `groupBy` is generic now, but `key: keyof T` still accepts `"hobbies"` — an
 * array-valued property that can't become a bucket label. Write a mapped type
 * that collapses `T` down to a union of only its string/number-valued keys,
 * and constrain `key` to that union instead of `keyof T`.
 */

const users = [
  { id: 1, name: "Adam", city: "OKC", hobbies: ["Working out"] },
  { id: 2, name: "Ken", city: "Wall Township", hobbies: ["Drinking"] },
  { id: 3, name: "Marc", city: "Minneapolis", hobbies: ["Gymnastics"] },
  { id: 4, name: "Dustin", city: "Minneapolis", hobbies: ["Golf"] },
];

function groupBy<T>(items: T[], key: keyof T) {
  const result: Record<string, T[]> = {};

  for (const item of items) {
    const value = String(item[key]);
    (result[value] ??= []).push(item);
  }
  return result;
}

groupBy(users, "id");
groupBy(users, "city");

// @ts-expect-error
groupBy(users, "hobbies");

export {};
