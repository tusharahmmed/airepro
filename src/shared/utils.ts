/* eslint-disable @typescript-eslint/no-explicit-any */

export function excludeFields<T, Key extends keyof T>(
  user: T,
  keys: Key[]
): Omit<T, Key> | { [k: string]: unknown } {
  return Object.fromEntries(
    Object.entries(user as any).filter(([key]) => !keys.includes(key as Key))
  );
}

export const asyncForEach = async (arr: any[], callback: any) => {
  if (!Array.isArray(arr)) {
    throw new Error('expected an array');
  }
  for (let i = 0; i < arr.length; i++) {
    await callback(arr[i], i, arr);
  }
};
