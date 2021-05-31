type JSONBasic = null | undefined | number | boolean | string | {};

interface RecursiveObject<T = unknown> {
  [key: string]: T | RecursiveObject<T>;
}

interface RecursiveInternalArray<T> {
  [key: number]: RecursiveInternalArray<T> | T[];
}

type RecursiveArray<T> = RecursiveInternalArray<T> | T[];

export type JSONValues =
  | JSONBasic
  | RecursiveObject<JSONBasic | JSONBasic[]>
  | RecursiveArray<JSONBasic | RecursiveObject<JSONBasic | JSONBasic[]>>;
