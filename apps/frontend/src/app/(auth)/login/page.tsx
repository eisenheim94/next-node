'use client';

import { AlertTriangleIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import {
  AuthEmailField,
  AuthPasswordField,
} from '@/components/entities/auth/auth-form-fields';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
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
} from '@/components/ui/field';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { saveAuthSession } from '@/lib/auth';
import { login } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const data = await login({
        email,
        password,
      });

      saveAuthSession(data.user, data.tokens);
      router.replace('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log in');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen px-6 py-12 md:px-12 content-center">
      <div className="flex flex-col gap-6 mx-auto max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(event) => {
                void handleSubmit(event);
              }}
            >
              <FieldGroup>
                <AuthEmailField
                  id="email"
                  label="Email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={setEmail}
                  disabled={isSubmitting}
                />
                <AuthPasswordField
                  value={password}
                  onChange={setPassword}
                  disabled={isSubmitting}
                />

                {!!error && (
                  <Alert
                    variant="destructive"
                    className="bg-red-50 dark:bg-red-950"
                  >
                    <AlertTriangleIcon />
                    <AlertTitle>Login failed!</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Field>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && (<Spinner className="me-2" />)}
                    Login
                  </Button>
                  <FieldDescription className="text-center">
                    Don't have an account? <Link href="/register">Sign up</Link>
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
