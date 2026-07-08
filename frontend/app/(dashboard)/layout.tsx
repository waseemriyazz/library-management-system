'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { ToastContainer } from '@/components/toast-container';
import { useToast } from '@/hooks/use-toast';
import { ToastContext } from '@/lib/toast-context';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { toasts, addToast, removeToast } = useToast();

  return (
    <ToastContext.Provider value={{ addToast }}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </ToastContext.Provider>
  );
}