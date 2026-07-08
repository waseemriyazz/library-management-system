'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { useToastContext } from '@/lib/toast-context';
import { fetchMember } from '@/lib/api/members';
import { MemberForm } from '../../member-form';
import { Member } from '@/lib/types';

export default function EditMemberPage() {
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
        addToast('Failed to load member', 'error');
        router.push('/members');
      } finally {
        setLoading(false);
      }
    }
    loadMember();
  }, [params.id, addToast, router]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-64 bg-gray-200 rounded" />
      </div>
    );
  }

  if (!member) return null;

  return (
    <div>
      <PageHeader
        title={`Edit: ${member.name}`}
        description="Update member information"
      />
      <MemberForm member={member} />
    </div>
  );
}