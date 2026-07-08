'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Card, CardContent } from '@/components/ui';
import { useToastContext } from '@/lib/toast-context';
import { fetchAuthor } from '@/lib/api/authors';
import { Author } from '@/lib/types';

export default function AuthorDetailPage() {
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
        addToast('Failed to load author details', 'error');
        router.push('/authors');
      } finally {
        setLoading(false);
      }
    }
    loadAuthor();
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

  if (!author) return null;

  return (
    <div>
      <div className="mb-6">
        <Link href="/authors" className="text-sm text-indigo-600 hover:text-indigo-800 mb-2 inline-block">
          &larr; Back to Authors
        </Link>
      </div>

      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{author.name}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="text-gray-900">{author.email || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Books Written</h3>
              <p className="text-gray-900">{author.books?.length || 0}</p>
            </div>
          </div>

          {author.bio && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Biography</h3>
              <p className="text-gray-700">{author.bio}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Link href={`/authors/${author.id}/edit`}>
              <Button variant="secondary">Edit Author</Button>
            </Link>
            <Button variant="ghost" onClick={() => router.push('/authors')}>
              Back to List
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}