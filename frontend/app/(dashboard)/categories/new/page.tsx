import { PageHeader } from '@/components/page-header';
import { CategoryForm } from '../category-form';

export default function NewCategoryPage() {
  return (
    <div>
      <PageHeader
        title="Add New Category"
        description="Add a new book category"
      />
      <CategoryForm />
    </div>
  );
}