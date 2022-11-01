import structuredClone from '@ungap/structured-clone';

export function removeUndefinedProps<T>(obj: T): T {
  const copy = structuredClone(obj);

  for (const key in copy) {
    if (copy[key] === undefined) {
      delete copy[key];
    }

    if (copy[key] === null) {
      continue;
    }

    if (Array.isArray(copy[key])) {
      continue;
    }

    if (typeof copy[key] === 'object') {
      copy[key] = removeUndefinedProps(copy[key]);
    }
  }

  return copy;
}
