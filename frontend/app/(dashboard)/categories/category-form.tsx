'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button, Input, Textarea, Card, CardContent } from '@/components/ui';
import { useToastContext } from '@/lib/toast-context';
import { createCategory, updateCategory } from '@/lib/api/categories';
import { Category } from '@/lib/types';

interface CategoryFormProps {
  category?: Category;
}

interface FormValues {
  name: string;
  description?: string;
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const { addToast } = useToastContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: category ? {
      name: category.name,
      description: category.description || '',
    } : undefined,
  });

  const onSubmit = async (data: FormValues) => {
    try {
      if (category) {
        await updateCategory(category.id, data);
        addToast('Category updated successfully', 'success');
      } else {
        await createCategory(data);
        addToast('Category created successfully', 'success');
      }
      router.push('/categories');
      router.refresh();
    } catch (err: any) {
      addToast(err.message || 'Failed to save category', 'error');
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
          <Input
            label="Name"
            {...register('name', { required: 'Name is required' })}
            error={errors.name?.message}
            placeholder="Enter category name"
          />
          <Textarea
            label="Description"
            {...register('description')}
            placeholder="Enter category description (optional)"
          />
          <div className="flex gap-3 pt-4">
            <Button type="submit">{category ? 'Update Category' : 'Create Category'}</Button>
            <Button type="button" variant="secondary" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}