'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button, Input, Textarea, Card, CardContent } from '@/components/ui';
import { useToastContext } from '@/lib/toast-context';
import { createAuthor, updateAuthor } from '@/lib/api/authors';
import { Author } from '@/lib/types';

interface AuthorFormProps {
  author?: Author;
}

interface FormValues {
  name: string;
  email?: string;
  bio?: string;
}

export function AuthorForm({ author }: AuthorFormProps) {
  const router = useRouter();
  const { addToast } = useToastContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: author ? {
      name: author.name,
      email: author.email || '',
      bio: author.bio || '',
    } : undefined,
  });

  const onSubmit = async (data: FormValues) => {
    try {
      if (author) {
        await updateAuthor(author.id, data);
        addToast('Author updated successfully', 'success');
      } else {
        await createAuthor(data);
        addToast('Author created successfully', 'success');
      }
      router.push('/authors');
      router.refresh();
    } catch (err: any) {
      addToast(err.message || 'Failed to save author', 'error');
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
            placeholder="Enter author name"
          />
          <Input
            label="Email"
            type="email"
            {...register('email')}
            placeholder="author@example.com (optional)"
          />
          <Textarea
            label="Biography"
            {...register('bio')}
            placeholder="Enter author biography (optional)"
          />
          <div className="flex gap-3 pt-4">
            <Button type="submit">{author ? 'Update Author' : 'Create Author'}</Button>
            <Button type="button" variant="secondary" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}