export const isUndefined = (value: unknown): value is undefined => {
  return typeof value === 'undefined';
};

export const isNull = (value: unknown): value is null => {
  return value === null;
};

export const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

export const isError = <T extends Error>(value: unknown): value is T => {
  return value instanceof Error;
};

export const isValidDate = (value: unknown): value is Date => {
  return value instanceof Date && !Number.isNaN(value.valueOf());
};
