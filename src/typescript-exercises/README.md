# TypeScript exercises — module 4

Standalone practice for module 4 (TypeScript for Frontend Engineers), the same way
`src/patterns/` holds module 3's practice exercises. These are not wired into Rasmi —
no import here reaches `app`, `features`, `ui`, `data` or `domain`, and nothing outside
this folder imports from it.

Each exercise is type-level work: the task is to make `exercise.ts` compile — including
every `// @ts-expect-error` line actually erroring — without loosening the repo's
`tsconfig.json`. `solution.ts` is the reference answer. Run `pnpm typecheck` to check
either file on its own terms by temporarily swapping the import, or just read the diff.

| Folder | Covers |
|---|---|
| `generics-groupby/` | Generics — constraining a parameter to `keyof T` |
| `conditional-types-utilities/` | Conditional types — `infer`, rebuilding `ReturnType`/`Parameters` |
| `mapped-types-serialize-dates/` | Mapped types — transforming a type's value types with `extends` inside `[K in keyof T]` |
| `mapped-types-constrain-keys/` | Mapped types — filtering a type's keys down to the ones matching a condition |
