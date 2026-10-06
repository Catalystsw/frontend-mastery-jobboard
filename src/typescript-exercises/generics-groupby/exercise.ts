/**
 * Generics — constrain the parameter to keyof T
 *
 * `groupBy` takes an array and a key, and buckets the array by that key. Right now
 * `key` is typed `any`, so TypeScript can't tell `"xxx"` apart from a real property —
 * make the function generic over the item type and constrain `key` to that type's
 * own property names.
 */

const users = [
  { id: 1, name: "Adam", city: "OKC", hobbies: ["Working out"] },
  { id: 2, name: "Ken", city: "Wall Township", hobbies: ["Drinking"] },
  { id: 3, name: "Marc", city: "Minneapolis", hobbies: ["Gymnastics"] },
  { id: 4, name: "Dustin", city: "Minneapolis", hobbies: ["Golf"] },
];

function groupBy(items: any[], key: any) {
  const result: Record<any, any[]> = {};

  for (const item of items) {
    const value = String(item[key]);
    (result[value] ??= []).push(item);
  }
  return result;
}

groupBy(users, "name");

// @ts-expect-error
groupBy(users, "xxx");

export {};
