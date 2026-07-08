'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Card, CardContent } from '@/components/ui';
import { useToastContext } from '@/lib/toast-context';
import { fetchCategory } from '@/lib/api/categories';
import { Category } from '@/lib/types';

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useToastContext();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategory() {
      try {
        const data = await fetchCategory(Number(params.id));
        setCategory(data);
      } catch {
        addToast('Failed to load category details', 'error');
        router.push('/categories');
      } finally {
        setLoading(false);
      }
    }
    loadCategory();
  }, [params.id, addToast, router]);

  if (loading) {
    return (
      <Card>
        <CardContent>
          <div className="animate-pulse space-y-4 p-6">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-20 bg-gray-200 rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!category) return null;

  return (
    <div>
      <div className="mb-6">
        <Link href="/categories" className="text-sm text-indigo-600 hover:text-indigo-800 mb-2 inline-block">
          &larr; Back to Categories
        </Link>
      </div>

      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{category.name}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <p className="text-gray-900">{category.description || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Books in Category</h3>
              <p className="text-gray-900">{category.books?.length || 0}</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Link href={`/categories/${category.id}/edit`}>
              <Button variant="secondary">Edit Category</Button>
            </Link>
            <Button variant="ghost" onClick={() => router.push('/categories')}>
              Back to List
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}