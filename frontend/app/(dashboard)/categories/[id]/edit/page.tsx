'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { useToastContext } from '@/lib/toast-context';
import { fetchCategory } from '@/lib/api/categories';
import { CategoryForm } from '../../category-form';
import { Category } from '@/lib/types';

export default function EditCategoryPage() {
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
        addToast('Failed to load category', 'error');
        router.push('/categories');
      } finally {
        setLoading(false);
      }
    }
    loadCategory();
  }, [params.id, addToast, router]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-64 bg-gray-200 rounded" />
      </div>
    );
  }

  if (!category) return null;

  return (
    <div>
      <PageHeader
        title={`Edit: ${category.name}`}
        description="Update category information"
      />
      <CategoryForm category={category} />
    </div>
  );
}