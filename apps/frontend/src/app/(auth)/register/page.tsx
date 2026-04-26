'use client';

import { AlertTriangleIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import {
  AuthEmailField,
  AuthPasswordField,
  AuthTextField,
} from '@/components/entities/auth/auth-form-fields';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { saveAuthSession } from '@/lib/auth';
import { register } from '@/lib/api';
import type { UserRole } from '@/types/user';

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('MEMBER');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const data = await register({
        email,
        displayName,
        password,
        role,
      });

      saveAuthSession(data.user, data.tokens);
      router.replace('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen px-6 py-12 md:px-12">
      <div className="flex flex-col gap-6 mx-auto max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle>Register new account</CardTitle>
            <CardDescription>
              Create an account and start using the protected app
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit}
            >
              <FieldGroup>
                <AuthTextField
                  id="displayName"
                  label="Display Name"
                  placeholder="Foo Bar"
                  value={displayName}
                  onChange={setDisplayName}
                  disabled={isSubmitting}
                />
                <AuthEmailField
                  id="email"
                  label="Email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={setEmail}
                  disabled={isSubmitting}
                />
                <AuthPasswordField
                  allowVisibilityToggle
                  value={password}
                  onChange={setPassword}
                  disabled={isSubmitting}
                />
                <Field>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="role">Role</FieldLabel>
                  </div>
                  <Select onValueChange={(value) => setRole(value as UserRole)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Role</SelectLabel>
                        <SelectItem value="MEMBER">Member</SelectItem>
                        <SelectItem value="MANAGER">Manager</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>

                {!!error && (
                  <Alert
                    variant="destructive"
                    className="bg-red-50 dark:bg-red-950"
                  >
                    <AlertTriangleIcon />
                    <AlertTitle>Registration failed!</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Field>
                  <Button type="submit">Register</Button>
                  <FieldDescription className="text-center">
                    Already have an account? <Link href="/login">Login</Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
