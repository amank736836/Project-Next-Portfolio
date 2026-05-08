import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the login API endpoint to initiate OAuth flow
    const loginUrl = '/api/auth/login';
    window.location.href = loginUrl;
  }, []);

  return (
    <div>
      <p>Redirecting to login...</p>
    </div>
  );
}