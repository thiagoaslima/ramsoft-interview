import { useMemo, useState } from 'react';

type UseToggleResponse = [
  state: boolean,
  modifiers: {
    open: VoidFunction;
    close: VoidFunction;
    toggle: VoidFunction;
  },
];

export function useToggle(initialState = false): UseToggleResponse {
  const [state, setState] = useState(initialState);

  const modifiers = useMemo(() => {
    return {
      open: () => setState(true),
      close: () => setState(false),
      toggle: () => setState((state) => !state),
    };
  }, []);

  return [state, modifiers];
}
