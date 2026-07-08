'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Button, Card, CardContent, Table } from '@/components/ui';
import { PageHeader } from '@/components/page-header';
import { SearchInput } from '@/components/search-input';
import { DeleteDialog } from '@/components/delete-dialog';
import { useToastContext } from '@/lib/toast-context';
import { fetchCategories, deleteCategory } from '@/lib/api/categories';
import { Category } from '@/lib/types';

export default function CategoriesPage() {
  const { addToast } = useToastContext();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadCategories = useCallback(async (searchTerm?: string) => {
    setLoading(true);
    try {
      const data = await fetchCategories(searchTerm);
      setCategories(data);
    } catch {
      addToast('Failed to load categories', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadCategories(search);
  }, [search, loadCategories]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteCategory(deleteId);
      addToast('Category deleted successfully', 'success');
      setCategories((prev) => prev.filter((c) => c.id !== deleteId));
      setDeleteId(null);
    } catch (err: any) {
      addToast(err.message || 'Failed to delete category', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { key: 'name', header: 'Name', render: (category: Category) => (
      <Link href={`/categories/${category.id}`} className="text-indigo-600 hover:text-indigo-800 font-medium">
        {category.name}
      </Link>
    )},
    { key: 'description', header: 'Description', render: (category: Category) => (
      <span className="text-gray-500 truncate max-w-xs block">
        {category.description || '-'}
      </span>
    )},
    { key: 'books', header: 'Books', render: (category: Category) => (
      <span className="text-gray-500">{category.books?.length || 0} books</span>
    )},
    { key: 'actions', header: 'Actions', render: (category: Category) => (
      <div className="flex gap-2">
        <Link
          href={`/categories/${category.id}/edit`}
          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
        >
          Edit
        </Link>
        <button
          onClick={() => setDeleteId(category.id)}
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
        title="Categories"
        description="Manage book categories"
        action={
          <Link href="/categories/new">
            <Button>+ Add Category</Button>
          </Link>
        }
      />

      <Card>
        <CardContent>
          <div className="mb-4">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search categories by name..."
            />
          </div>

          <Table
            columns={columns}
            data={categories}
            keyExtractor={(category) => category.id}
            loading={loading}
            emptyMessage="No categories found. Add your first category to get started."
          />
        </CardContent>
      </Card>

      <DeleteDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
        loading={deleting}
      />
    </div>
  );
}