'use client';

import * as React from 'react';

export type ToastProps = {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
};

type ToastState = {
  toasts: ToastProps[];
};

const listeners: Array<(state: ToastState) => void> = [];
let memoryState: ToastState = { toasts: [] };

function dispatch(state: ToastState) {
  memoryState = state;
  listeners.forEach((listener) => listener(state));
}

function addToast(toast: Omit<ToastProps, 'id'>) {
  const id = Math.random().toString(36).substr(2, 9);
  dispatch({ toasts: [...memoryState.toasts, { id, ...toast }] });
  setTimeout(() => {
    dispatch({ toasts: memoryState.toasts.filter((t) => t.id !== id) });
  }, 5000);
}

export function useToast() {
  const [state, setState] = React.useState<ToastState>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) listeners.splice(index, 1);
    };
  }, [state]);

  return {
    toast: (props: Omit<ToastProps, 'id'>) => addToast(props),
    toasts: state.toasts,
    dismiss: (id: string) => {
      dispatch({ toasts: memoryState.toasts.filter((t) => t.id !== id) });
    },
  };
}

export const toast = (props: Omit<ToastProps, 'id'>) => addToast(props);
