/**
 * Mapped types — transform a type's value types
 *
 * `DbUser.createdAt` is a `Date` locally, but once it crosses `JSON.stringify`
 * it's a `string`. Write a mapped type that walks every key of `T` and swaps
 * any `Date`-typed property for `string`, leaving every other property alone.
 */

type DbUser = {
  id: number;
  name: string;
  createdAt: Date;
};

type SerializeDates<T> = never;

type SerializedDbUser = SerializeDates<DbUser>; // should be { id: number; name: string; createdAt: string }

export {};
