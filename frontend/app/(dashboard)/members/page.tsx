'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Button, Card, CardContent, Table } from '@/components/ui';
import { PageHeader } from '@/components/page-header';
import { SearchInput } from '@/components/search-input';
import { DeleteDialog } from '@/components/delete-dialog';
import { useToastContext } from '@/lib/toast-context';
import { fetchMembers, deleteMember } from '@/lib/api/members';
import { Member } from '@/lib/types';

export default function MembersPage() {
  const { addToast } = useToastContext();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadMembers = useCallback(async (searchTerm?: string) => {
    setLoading(true);
    try {
      const data = await fetchMembers(searchTerm);
      setMembers(data);
    } catch {
      addToast('Failed to load members', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadMembers(search);
  }, [search, loadMembers]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteMember(deleteId);
      addToast('Member deleted successfully', 'success');
      setMembers((prev) => prev.filter((m) => m.id !== deleteId));
      setDeleteId(null);
    } catch (err: any) {
      addToast(err.message || 'Failed to delete member', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { key: 'name', header: 'Name', render: (member: Member) => (
      <Link href={`/members/${member.id}`} className="text-indigo-600 hover:text-indigo-800 font-medium">
        {member.name}
      </Link>
    )},
    { key: 'email', header: 'Email', render: (member: Member) => member.email || '-' },
    { key: 'phone', header: 'Phone', render: (member: Member) => member.phone || '-' },
    { key: 'membershipDate', header: 'Member Since', render: (member: Member) =>
      member.membershipDate
        ? new Date(member.membershipDate).toLocaleDateString()
        : '-'
    },
    { key: 'actions', header: 'Actions', render: (member: Member) => (
      <div className="flex gap-2">
        <Link
          href={`/members/${member.id}/edit`}
          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
        >
          Edit
        </Link>
        <button
          onClick={() => setDeleteId(member.id)}
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
        title="Members"
        description="Manage library members"
        action={
          <Link href="/members/new">
            <Button>+ Add Member</Button>
          </Link>
        }
      />

      <Card>
        <CardContent>
          <div className="mb-4">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search members by name..."
            />
          </div>

          <Table
            columns={columns}
            data={members}
            keyExtractor={(member) => member.id}
            loading={loading}
            emptyMessage="No members found. Register your first member to get started."
          />
        </CardContent>
      </Card>

      <DeleteDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Member"
        description="Are you sure you want to delete this member? This action cannot be undone."
        loading={deleting}
      />
    </div>
  );
}