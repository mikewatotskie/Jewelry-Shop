import { useCallback, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

/** Commit before updating the UI. No delayed save, and no SQL inside React's replayable updater. */
export function useDatabaseState<T>(initial: T, persist: (next: T) => T):
  [T, Dispatch<SetStateAction<T>>, (value: T) => void] {
  const [value, setValue] = useState(initial);
  const current = useRef(initial);
  const hydrate = useCallback((next: T) => {
    current.current = next;
    setValue(next);
  }, []);
  const update: Dispatch<SetStateAction<T>> = useCallback((action) => {
    const next = typeof action === 'function' ? (action as (previous: T) => T)(current.current) : action;
    hydrate(persist(next));
  }, [hydrate, persist]);
  return [value, update, hydrate];
}
