/**
 * A receivable type is a type received from the internet.
 * It is `undefined` when uninitialised, `T` when successful, and `null` when failed.
 */
export type Receivable<T> = T | null | undefined;
