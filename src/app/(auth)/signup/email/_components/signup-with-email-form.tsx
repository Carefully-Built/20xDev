'use client';

import { FormProvider } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { CustomInputField, CustomPasswordField } from '@/components/forms';
import { useSignupForm } from '@/hooks/use-signup-form';

export function SignUpWithEmailForm(): React.ReactElement {
  const { form, onSubmit, loading, error } = useSignupForm();

  return (
    <FormProvider {...form}>
      <form
        className="space-y-3"
        onSubmit={(e): void => {
          void form.handleSubmit(onSubmit)(e);
        }}
      >
        <CustomInputField
          name="email"
          label="Email"
          placeholder="you@example.com"
          type="email"
          disabled={loading}
        />

        <CustomPasswordField
          name="password"
          label="Password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          disabled={loading}
          showRequirements
        />

        {error && (
          <div className="bg-destructive/15 text-destructive rounded-md p-3 text-sm">{error}</div>
        )}

        <Button className="w-full" disabled={loading} type="submit">
          {loading ? 'Creating account...' : 'Sign up'}
        </Button>
      </form>
    </FormProvider>
  );
}
