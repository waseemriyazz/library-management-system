import { PageHeader } from '@/components/page-header';
import { AuthorForm } from '../author-form';

export default function NewAuthorPage() {
  return (
    <div>
      <PageHeader
        title="Add New Author"
        description="Add a new author to the library"
      />
      <AuthorForm />
    </div>
  );
}