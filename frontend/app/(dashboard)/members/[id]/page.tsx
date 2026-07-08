'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Card, CardContent } from '@/components/ui';
import { useToastContext } from '@/lib/toast-context';
import { fetchMember } from '@/lib/api/members';
import { Member } from '@/lib/types';

export default function MemberDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useToastContext();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMember() {
      try {
        const data = await fetchMember(Number(params.id));
        setMember(data);
      } catch {
        addToast('Failed to load member details', 'error');
        router.push('/members');
      } finally {
        setLoading(false);
      }
    }
    loadMember();
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

  if (!member) return null;

  return (
    <div>
      <div className="mb-6">
        <Link href="/members" className="text-sm text-indigo-600 hover:text-indigo-800 mb-2 inline-block">
          &larr; Back to Members
        </Link>
      </div>

      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{member.name}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="text-gray-900">{member.email || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Phone</h3>
              <p className="text-gray-900">{member.phone || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Address</h3>
              <p className="text-gray-900">{member.address || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Membership Date</h3>
              <p className="text-gray-900">
                {member.membershipDate
                  ? new Date(member.membershipDate).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Link href={`/members/${member.id}/edit`}>
              <Button variant="secondary">Edit Member</Button>
            </Link>
            <Button variant="ghost" onClick={() => router.push('/members')}>
              Back to List
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}