'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { useToastContext } from '@/lib/toast-context';
import { fetchBook } from '@/lib/api/books';
import { BookForm } from '../../book-form';
import { Book } from '@/lib/types';

export default function EditBookPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useToastContext();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBook() {
      try {
        const data = await fetchBook(Number(params.id));
        setBook(data);
      } catch {
        addToast('Failed to load book', 'error');
        router.push('/books');
      } finally {
        setLoading(false);
      }
    }
    loadBook();
  }, [params.id, addToast, router]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-64 bg-gray-200 rounded" />
      </div>
    );
  }

  if (!book) return null;

  return (
    <div>
      <PageHeader
        title={`Edit: ${book.title}`}
        description="Update book information"
      />
      <BookForm book={book} />
    </div>
  );
}