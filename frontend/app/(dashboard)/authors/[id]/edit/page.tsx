'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { useToastContext } from '@/lib/toast-context';
import { fetchAuthor } from '@/lib/api/authors';
import { AuthorForm } from '../../author-form';
import { Author } from '@/lib/types';

export default function EditAuthorPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useToastContext();
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAuthor() {
      try {
        const data = await fetchAuthor(Number(params.id));
        setAuthor(data);
      } catch {
        addToast('Failed to load author', 'error');
        router.push('/authors');
      } finally {
        setLoading(false);
      }
    }
    loadAuthor();
  }, [params.id, addToast, router]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-64 bg-gray-200 rounded" />
      </div>
    );
  }

  if (!author) return null;

  return (
    <div>
      <PageHeader
        title={`Edit: ${author.name}`}
        description="Update author information"
      />
      <AuthorForm author={author} />
    </div>
  );
}