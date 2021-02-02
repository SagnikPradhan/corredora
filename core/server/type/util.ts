export interface RecursiveObject<Value> {
  [index: string]: Value | RecursiveObject<Value>;
}

export type Nullable<T> = T | null;
