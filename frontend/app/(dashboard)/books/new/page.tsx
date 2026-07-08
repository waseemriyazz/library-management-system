import { PageHeader } from '@/components/page-header';
import { BookForm } from '../book-form';

export default function NewBookPage() {
  return (
    <div>
      <PageHeader
        title="Add New Book"
        description="Add a new book to the library"
      />
      <BookForm />
    </div>
  );
}