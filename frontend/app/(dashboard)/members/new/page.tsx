import { PageHeader } from '@/components/page-header';
import { MemberForm } from '../member-form';

export default function NewMemberPage() {
  return (
    <div>
      <PageHeader
        title="Add New Member"
        description="Register a new library member"
      />
      <MemberForm />
    </div>
  );
}