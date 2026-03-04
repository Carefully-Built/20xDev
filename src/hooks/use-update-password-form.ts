import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { resetPassword } from '@/app/(auth)/actions';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/schemas/auth';

interface UseUpdatePasswordFormResult {
  form: ReturnType<typeof useForm<ResetPasswordFormData>>;
  onSubmit: (data: ResetPasswordFormData) => Promise<void>;
  loading: boolean;
  error: string | undefined;
  token: string | null;
}

export function useUpdatePasswordForm(): UseUpdatePasswordFormResult {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const form = useForm<ResetPasswordFormData>({
    // Type assertion needed due to Zod 4.x / hookform resolver type mismatch
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    resolver: zodResolver(resetPasswordSchema as any) as any,
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormData): Promise<void> => {
    setLoading(true);
    setError(undefined);

    if (!token) {
      setError('Invalid reset token');
      setLoading(false);
      return;
    }

    try {
      const result = await resetPassword(token, data.password);

      if (result.success) {
        router.push('/login/email?reset=success');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    onSubmit,
    loading,
    error,
    token,
  };
}
