/** Solution — see exercise.ts for the task. */

type GetReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer U
  ? U
  : never;

type GetParameters<T extends (...args: any) => any> = T extends (
  ...args: infer U
) => any
  ? U
  : never;

type X = (a: number, b: string) => string[];

type Str = GetReturnType<X>; // string[]

type StringAndNumber = (s: string, n: number) => string[];

type Args = GetParameters<StringAndNumber>; // [s: string, n: number]

export {};
