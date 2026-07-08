'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button, Input, Textarea, Select, Card, CardContent } from '@/components/ui';
import { useToastContext } from '@/lib/toast-context';
import { createBook, updateBook } from '@/lib/api/books';
import { fetchAuthors } from '@/lib/api/authors';
import { fetchCategories } from '@/lib/api/categories';
import { Book, CreateBookDto, UpdateBookDto, Author, Category } from '@/lib/types';

interface BookFormProps {
  book?: Book;
}

interface FormValues {
  title: string;
  isbn: string;
  description?: string;
  publishedDate?: string;
  pageCount?: number;
  authorId: number;
  categoryId: number;
}

export function BookForm({ book }: BookFormProps) {
  const router = useRouter();
  const { addToast } = useToastContext();
  const [loading, setLoading] = useState(false);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [fetchingData, setFetchingData] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  useEffect(() => {
    async function loadFormData() {
      try {
        const [authorsData, categoriesData] = await Promise.all([
          fetchAuthors(),
          fetchCategories(),
        ]);
        setAuthors(authorsData);
        setCategories(categoriesData);

        if (book) {
          reset({
            title: book.title,
            isbn: book.isbn,
            description: book.description || '',
            publishedDate: book.publishedDate ? book.publishedDate.split('T')[0] : '',
            pageCount: book.pageCount,
            authorId: book.authorId,
            categoryId: book.categoryId,
          });
        }
      } catch {
        addToast('Failed to load form data', 'error');
      } finally {
        setFetchingData(false);
      }
    }
    loadFormData();
  }, [book, reset, addToast]);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      if (book) {
        await updateBook(book.id, data as UpdateBookDto);
        addToast('Book updated successfully', 'success');
      } else {
        await createBook(data as CreateBookDto);
        addToast('Book created successfully', 'success');
      }
      router.push('/books');
      router.refresh();
    } catch (err: any) {
      addToast(err.message || 'Failed to save book', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <Card>
        <CardContent>
          <div className="space-y-4 animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-1/3" />
            <div className="h-10 bg-gray-200 rounded w-1/3" />
            <div className="h-24 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded w-1/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Title"
              {...register('title', { required: 'Title is required' })}
              error={errors.title?.message}
              placeholder="Enter book title"
            />
            <Input
              label="ISBN (13 digits)"
              {...register('isbn', {
                required: 'ISBN is required',
                pattern: {
                  value: /^\d{13}$/,
                  message: 'ISBN must be a 13-digit number',
                },
              })}
              error={errors.isbn?.message}
              placeholder="9783161484100"
            />
          </div>

          <Textarea
            label="Description"
            {...register('description')}
            placeholder="Enter book description (optional)"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Published Date"
              type="date"
              {...register('publishedDate')}
            />
            <Input
              label="Page Count"
              type="number"
              {...register('pageCount', { valueAsNumber: true })}
              placeholder="Number of pages"
            />
            <Select
              label="Author"
              options={authors.map((a) => ({ value: a.id, label: a.name }))}
              placeholder="Select an author"
              {...register('authorId', {
                required: 'Author is required',
                valueAsNumber: true,
                validate: (v) => v > 0 || 'Please select an author',
              })}
              error={errors.authorId?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Category"
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
              placeholder="Select a category"
              {...register('categoryId', {
                required: 'Category is required',
                valueAsNumber: true,
                validate: (v) => v > 0 || 'Please select a category',
              })}
              error={errors.categoryId?.message}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" loading={loading}>
              {book ? 'Update Book' : 'Create Book'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}