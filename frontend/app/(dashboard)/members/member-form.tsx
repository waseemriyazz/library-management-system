'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button, Input, Textarea, Card, CardContent } from '@/components/ui';
import { useToastContext } from '@/lib/toast-context';
import { createMember, updateMember } from '@/lib/api/members';
import { Member } from '@/lib/types';

interface MemberFormProps {
  member?: Member;
}

interface FormValues {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  membershipDate?: string;
}

export function MemberForm({ member }: MemberFormProps) {
  const router = useRouter();
  const { addToast } = useToastContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: member ? {
      name: member.name,
      email: member.email || '',
      phone: member.phone || '',
      address: member.address || '',
      membershipDate: member.membershipDate ? member.membershipDate.split('T')[0] : '',
    } : undefined,
  });

  const onSubmit = async (data: FormValues) => {
    try {
      if (member) {
        await updateMember(member.id, data);
        addToast('Member updated successfully', 'success');
      } else {
        await createMember(data);
        addToast('Member created successfully', 'success');
      }
      router.push('/members');
      router.refresh();
    } catch (err: any) {
      addToast(err.message || 'Failed to save member', 'error');
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
            placeholder="Enter member name"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Email"
              type="email"
              {...register('email')}
              placeholder="member@example.com (optional)"
            />
            <Input
              label="Phone"
              type="tel"
              {...register('phone')}
              placeholder="+1 234 567 890 (optional)"
            />
          </div>
          <Textarea
            label="Address"
            {...register('address')}
            placeholder="Enter address (optional)"
          />
          <Input
            label="Membership Date"
            type="date"
            {...register('membershipDate')}
          />
          <div className="flex gap-3 pt-4">
            <Button type="submit">{member ? 'Update Member' : 'Create Member'}</Button>
            <Button type="button" variant="secondary" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}