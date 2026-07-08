'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Button, Card, CardContent, Table } from '@/components/ui';
import { PageHeader } from '@/components/page-header';
import { SearchInput } from '@/components/search-input';
import { DeleteDialog } from '@/components/delete-dialog';
import { useToastContext } from '@/lib/toast-context';
import { fetchAuthors, deleteAuthor } from '@/lib/api/authors';
import { Author } from '@/lib/types';

export default function AuthorsPage() {
  const { addToast } = useToastContext();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadAuthors = useCallback(async (searchTerm?: string) => {
    setLoading(true);
    try {
      const data = await fetchAuthors(searchTerm);
      setAuthors(data);
    } catch {
      addToast('Failed to load authors', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadAuthors(search);
  }, [search, loadAuthors]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteAuthor(deleteId);
      addToast('Author deleted successfully', 'success');
      setAuthors((prev) => prev.filter((a) => a.id !== deleteId));
      setDeleteId(null);
    } catch (err: any) {
      addToast(err.message || 'Failed to delete author', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { key: 'name', header: 'Name', render: (author: Author) => (
      <Link href={`/authors/${author.id}`} className="text-indigo-600 hover:text-indigo-800 font-medium">
        {author.name}
      </Link>
    )},
    { key: 'email', header: 'Email', render: (author: Author) => author.email || '-' },
    { key: 'books', header: 'Books', render: (author: Author) => (
      <span className="text-gray-500">{author.books?.length || 0} books</span>
    )},
    { key: 'actions', header: 'Actions', render: (author: Author) => (
      <div className="flex gap-2">
        <Link
          href={`/authors/${author.id}/edit`}
          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
        >
          Edit
        </Link>
        <button
          onClick={() => setDeleteId(author.id)}
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
        title="Authors"
        description="Manage book authors"
        action={
          <Link href="/authors/new">
            <Button>+ Add Author</Button>
          </Link>
        }
      />

      <Card>
        <CardContent>
          <div className="mb-4">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search authors by name..."
            />
          </div>

          <Table
            columns={columns}
            data={authors}
            keyExtractor={(author) => author.id}
            loading={loading}
            emptyMessage="No authors found. Add your first author to get started."
          />
        </CardContent>
      </Card>

      <DeleteDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Author"
        description="Are you sure you want to delete this author? This action cannot be undone."
        loading={deleting}
      />
    </div>
  );
}