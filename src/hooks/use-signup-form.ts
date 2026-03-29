import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { signUp } from '@/app/(auth)/actions';
import { signupSchema, type SignupFormData } from '@/schemas/auth';

interface UseSignupFormResult {
  form: ReturnType<typeof useForm<SignupFormData>>;
  onSubmit: (data: SignupFormData) => Promise<void>;
  loading: boolean;
  error: string | undefined;
}

export function useSignupForm(): UseSignupFormResult {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const form = useForm<SignupFormData>({
    // Type assertion needed due to Zod 4.x / hookform resolver type mismatch
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    resolver: zodResolver(signupSchema as any) as any,
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignupFormData): Promise<void> => {
    setLoading(true);
    setError(undefined);

    try {
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);

      const result = await signUp(formData);

      if (result.success) {
        router.push('/dashboard');
      } else {
        setError(result.error);
        // Clear password on error for security
        form.setValue('password', '');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      form.setValue('password', '');
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    onSubmit,
    loading,
    error,
  };
}
