'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';

import type { ReactNode } from 'react';
import type { DefaultValues, FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form';
import type { z } from 'zod';

interface CustomFormProps<T extends FieldValues> {
  readonly schema: z.ZodType<T>;
  readonly defaultValues: DefaultValues<T>;
  readonly onSubmit: SubmitHandler<T>;
  readonly children: ReactNode | ((methods: UseFormReturn<T>) => ReactNode);
  readonly id?: string;
  readonly className?: string;
}

export function CustomForm<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  children,
  id,
  className,
}: CustomFormProps<T>): React.ReactElement {
  const methods = useForm<T>({
    // Type assertion needed due to Zod 4.x / hookform resolver type mismatch
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any) as any,
    defaultValues,
    mode: 'onBlur',
  });

  return (
    <FormProvider {...methods}>
      <form
        id={id}
        className={className}
        onSubmit={(e) => {
          e.preventDefault();
          void methods.handleSubmit(onSubmit)(e);
        }}
      >
        {typeof children === 'function' ? children(methods) : children}
      </form>
    </FormProvider>
  );
}
