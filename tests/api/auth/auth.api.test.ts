import { expect, test } from '@playwright/test';

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

type AuthErrorResponse = {
  error?: string;
  error_description?: string;
  message?: string;
  msg?: string;
};

test.describe('Auth API', () => {
  test('should reject invalid login credentials', async ({ request }) => {
    const supabaseUrl = requiredEnv('NEXT_PUBLIC_SUPABASE_URL').replace(/\/$/, '');
    const supabaseAnonKey = requiredEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

    const response = await request.post(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      headers: {
        apikey: supabaseAnonKey,
        'Content-Type': 'application/json',
      },
      data: {
        email: 'invalid-user@example.com',
        password: 'invalid-password',
      },
    });

    expect(response.status()).toBe(400);
    expect(response.ok()).toBe(false);

    const body = await response.json() as AuthErrorResponse;
    expect(body.error ?? body.error_description ?? body.message ?? body.msg).toBeTruthy();
  });
});