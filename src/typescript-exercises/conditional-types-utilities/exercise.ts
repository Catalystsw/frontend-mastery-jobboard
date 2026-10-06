/**
 * Conditional types — rebuild ReturnType and Parameters with infer
 *
 * Both utilities below are stubbed to `never`. Replace each with a conditional type
 * that pattern-matches a function signature and `infer`s the piece it needs.
 */

type GetReturnType<T extends (...args: any) => any> = never;

type GetParameters<T extends (...args: any) => any> = never;

type X = (a: number, b: string) => string[];

type Str = GetReturnType<X>; // should be string[]

type StringAndNumber = (s: string, n: number) => string[];

type Args = GetParameters<StringAndNumber>; // should be [s: string, n: number]

export {};
