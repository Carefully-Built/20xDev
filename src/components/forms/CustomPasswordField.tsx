'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';

import type { FieldValues, Path } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';


interface CustomPasswordFieldProps<TValues extends FieldValues> {
  name: Path<TValues>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
  className?: string;
}

export function CustomPasswordField<TValues extends FieldValues>({
  name,
  label,
  placeholder,
  disabled = false,
  autoFocus = false,
  autoComplete = 'current-password',
  className,
}: CustomPasswordFieldProps<TValues>): React.ReactElement {
  const { control } = useFormContext<TValues>();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className={cn('space-y-2', className)}>
          {label ? (
            <Label htmlFor={name} className={error ? 'text-destructive' : ''}>
              {label}
            </Label>
          ) : null}
          <div className="relative">
            <Input
              {...field}
              id={name}
              type={showPassword ? 'text' : 'password'}
              placeholder={placeholder}
              disabled={disabled}
              autoFocus={autoFocus}
              autoComplete={autoComplete}
              className={cn('pr-10', error ? 'border-destructive' : '')}
              value={field.value ?? ''}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => { setShowPassword(!showPassword); }}
              disabled={disabled}
            >
              {showPassword ? (
                <EyeOff className="size-4 text-muted-foreground" />
              ) : (
                <Eye className="size-4 text-muted-foreground" />
              )}
              <span className="sr-only">
                {showPassword ? 'Hide password' : 'Show password'}
              </span>
            </Button>
          </div>
          {error?.message ? (
            <p className="text-sm text-destructive">{error.message}</p>
          ) : null}
        </div>
      )}
    />
  );
}
