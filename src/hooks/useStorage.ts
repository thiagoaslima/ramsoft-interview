// Adapted from https://usehooks.com/useLocalStorage/

import { useState } from 'react';
import { LocalStorageDb } from '@database/storage/LocalStorage';
import { MemoryStorageDb } from '@database/storage/MemoryStorage';

const getPersistenceService = () => {
  try {
    return LocalStorageDb.create();
  } catch {
    return MemoryStorageDb.create();
  }
};

const storage = getPersistenceService();

export function useStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const itemResult = storage.get<T>(key);

    if (itemResult.success) {
      return itemResult.data ?? initialValue;
    } else {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)): ReturnType<typeof storage.save> => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;

    setStoredValue(valueToStore);
    return storage.save(key, valueToStore);
  };

  return [storedValue, setValue] as const;
}
