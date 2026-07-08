'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Badge, Card, CardContent } from '@/components/ui';
import { useToastContext } from '@/lib/toast-context';
import { fetchBook } from '@/lib/api/books';
import { Book } from '@/lib/types';

export default function BookDetailPage() {
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
        addToast('Failed to load book details', 'error');
        router.push('/books');
      } finally {
        setLoading(false);
      }
    }
    loadBook();
  }, [params.id, addToast, router]);

  if (loading) {
    return (
      <Card>
        <CardContent>
          <div className="animate-pulse space-y-4 p-6">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-20 bg-gray-200 rounded" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!book) return null;

  return (
    <div>
      <div className="mb-6">
        <Link href="/books" className="text-sm text-indigo-600 hover:text-indigo-800 mb-2 inline-block">
          &larr; Back to Books
        </Link>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{book.title}</h1>
              <p className="text-sm text-gray-500 mt-1">ISBN: {book.isbn}</p>
            </div>
            <Badge variant={book.available ? 'success' : 'danger'}>
              {book.available ? 'Available' : 'Borrowed'}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Author</h3>
              <p className="text-gray-900">{book.author?.name || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Category</h3>
              <p className="text-gray-900">{book.category?.name || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Page Count</h3>
              <p className="text-gray-900">{book.pageCount || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Published Date</h3>
              <p className="text-gray-900">
                {book.publishedDate ? new Date(book.publishedDate).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>

          {book.description && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
              <p className="text-gray-700">{book.description}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Link href={`/books/${book.id}/edit`}>
              <Button variant="secondary">Edit Book</Button>
            </Link>
            <Button variant="ghost" onClick={() => router.push('/books')}>
              Back to List
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}