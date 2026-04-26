'use client';

import { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

interface AuthInputFieldProps {
  disabled?: boolean;
  id: string;
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email';
  value: string;
}

interface AuthPasswordFieldProps {
  allowVisibilityToggle?: boolean;
  disabled?: boolean;
  id?: string;
  label?: string;
  onChange: (value: string) => void;
  value: string;
}

function AuthInputField({
  disabled = false,
  id,
  label,
  onChange,
  placeholder,
  type = 'text',
  value,
}: AuthInputFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        disabled={disabled}
      />
    </Field>
  );
}

export function AuthTextField(props: AuthInputFieldProps) {
  return <AuthInputField {...props} type="text" />;
}

export function AuthEmailField(props: Omit<AuthInputFieldProps, 'type'>) {
  return <AuthInputField {...props} type="email" />;
}

export function AuthPasswordField({
  allowVisibilityToggle = false,
  disabled = false,
  id = 'password',
  label = 'Password',
  onChange,
  value,
}: AuthPasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Field>
      <div className="flex items-center justify-between">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        {allowVisibilityToggle ? (
          <Button
            variant="ghost"
            className="h-auto border-0 bg-transparent p-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
            type="button"
            onClick={() => setShowPassword((previous) => !previous)}
          >
            {showPassword ? 'Hide' : 'Show'}
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </Button>
        ) : null}
      </div>
      <Input
        id={id}
        type={showPassword ? 'text' : 'password'}
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
      />
    </Field>
  );
}
