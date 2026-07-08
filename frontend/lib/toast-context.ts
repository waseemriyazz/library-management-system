'use client';

import { createContext, useContext } from 'react';
import { Toast } from '@/hooks/use-toast';

interface ToastContextValue {
  addToast: (message: string, type?: Toast['type']) => void;
}

export const ToastContext = createContext<ToastContextValue>({
  addToast: () => {},
});

export function useToastContext() {
  return useContext(ToastContext);
}