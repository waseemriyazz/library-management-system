'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Badge, Card, CardContent, Table } from '@/components/ui';
import { PageHeader } from '@/components/page-header';
import { SearchInput } from '@/components/search-input';
import { DeleteDialog } from '@/components/delete-dialog';
import { useToastContext } from '@/lib/toast-context';
import { fetchBooks, deleteBook } from '@/lib/api/books';
import { fetchAuthors } from '@/lib/api/authors';
import { fetchCategories } from '@/lib/api/categories';
import { Book } from '@/lib/types';

export default function BooksPage() {
  const router = useRouter();
  const { addToast } = useToastContext();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadBooks = useCallback(async (searchTerm?: string) => {
    setLoading(true);
    try {
      const data = await fetchBooks(searchTerm);
      setBooks(data);
    } catch {
      addToast('Failed to load books', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadBooks(search);
  }, [search, loadBooks]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteBook(deleteId);
      addToast('Book deleted successfully', 'success');
      setBooks((prev) => prev.filter((b) => b.id !== deleteId));
      setDeleteId(null);
    } catch (err: any) {
      addToast(err.message || 'Failed to delete book', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { key: 'title', header: 'Title', render: (book: Book) => (
      <Link href={`/books/${book.id}`} className="text-indigo-600 hover:text-indigo-800 font-medium">
        {book.title}
      </Link>
    )},
    { key: 'isbn', header: 'ISBN', render: (book: Book) => (
      <span className="text-gray-500 font-mono text-xs">{book.isbn}</span>
    )},
    { key: 'author', header: 'Author', render: (book: Book) => book.author?.name || '-' },
    { key: 'category', header: 'Category', render: (book: Book) => book.category?.name || '-' },
    { key: 'available', header: 'Status', render: (book: Book) => (
      <Badge variant={book.available ? 'success' : 'danger'}>
        {book.available ? 'Available' : 'Borrowed'}
      </Badge>
    )},
    { key: 'actions', header: 'Actions', render: (book: Book) => (
      <div className="flex gap-2">
        <Link
          href={`/books/${book.id}/edit`}
          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
        >
          Edit
        </Link>
        <button
          onClick={() => setDeleteId(book.id)}
          className="text-red-600 hover:text-red-800 text-sm font-medium"
        >
          Delete
        </button>
      </div>
    )},
  ];

  return (
    <div>
      <PageHeader
        title="Books"
        description="Manage your book collection"
        action={
          <Link href="/books/new">
            <Button>+ Add Book</Button>
          </Link>
        }
      />

      <Card>
        <CardContent>
          <div className="mb-4">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search books by title..."
            />
          </div>

          <Table
            columns={columns}
            data={books}
            keyExtractor={(book) => book.id}
            loading={loading}
            emptyMessage="No books found. Add your first book to get started."
          />
        </CardContent>
      </Card>

      <DeleteDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Book"
        description="Are you sure you want to delete this book? This action cannot be undone."
        loading={deleting}
      />
    </div>
  );
}