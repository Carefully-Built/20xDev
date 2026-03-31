'use client';

import { Check, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import zxcvbn from 'zxcvbn';

import type { FieldValues, Path } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const DEFAULT_REQUIREMENTS: PasswordRequirement[] = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'Contains uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'Contains lowercase letter', test: (p) => /[a-z]/.test(p) },
  { label: 'Contains number', test: (p) => /\d/.test(p) },
  { label: 'Contains special character', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
  { label: 'Not easily guessable', test: (p) => p.length >= 8 && zxcvbn(p).score >= 3 },
];

interface CustomPasswordFieldProps<TValues extends FieldValues> {
  name: Path<TValues>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
  className?: string;
  showRequirements?: boolean;
  requirements?: PasswordRequirement[];
}

export function CustomPasswordField<TValues extends FieldValues>({
  name,
  label,
  placeholder,
  disabled = false,
  autoFocus = false,
  autoComplete = 'current-password',
  className,
  showRequirements = false,
  requirements = DEFAULT_REQUIREMENTS,
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
              className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => {
                setShowPassword(!showPassword);
              }}
              disabled={disabled}
            >
              {showPassword ? (
                <EyeOff className="text-muted-foreground size-4" />
              ) : (
                <Eye className="text-muted-foreground size-4" />
              )}
              <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
            </Button>
          </div>
          {error?.message ? <p className="text-destructive text-sm">{error.message}</p> : null}
          {showRequirements && (
            <ul className="space-y-1 pt-1">
              {requirements.map((req, index) => {
                const met = req.test(field.value ?? '');
                return (
                  <li
                    key={index}
                    className={cn(
                      'flex items-center gap-2 text-xs transition-colors',
                      met ? 'text-green-600' : 'text-muted-foreground',
                    )}
                  >
                    <Check className={cn('size-3.5', met ? 'opacity-100' : 'opacity-30')} />
                    {req.label}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    />
  );
}
