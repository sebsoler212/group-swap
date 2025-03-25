// pages/auth/callback.tsx
import { useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const updateSession = async () => {
      // Parse hash fragment and store session in cookie
      const { data, error } = await supabase.auth.getSession();

      if (data.session) {
        router.replace('/profile');
      } else {
        // Wait a bit and retry (OAuth race condition)
        setTimeout(updateSession, 300);
      }
    };

    updateSession();
  }, [router]);

  return <p>Logging you in...</p>;
}
