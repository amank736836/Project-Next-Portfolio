import { scalekit } from '@/lib/scalekit';
import { redirect } from 'next/navigation';

export async function GET() {
  const redirectUri = 'http://localhost:3000/api/auth/callback';
  const options = {
    state: 'random_secure_string',
  };

  const authUrl = scalekit.getAuthorizationUrl(redirectUri, options);
  return redirect(authUrl);
}
