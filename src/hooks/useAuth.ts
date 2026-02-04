import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/lib/auth';
import { AuthUser } from '@/lib/auth';

interface UseAuthReturn {
  user: AuthUser | null;
  userProfile: any | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get current session
    const getSession = async () => {
      try {
        const session = await authService.getSession();
        if (session?.user) {
          setUser(session.user as AuthUser);
          try {
            const profile = await authService.getUserProfile(session.user.id);
            setUserProfile(profile);
          } catch (profileError) {
            console.error('Failed to load profile:', profileError);
            // Continue without profile rather than blocking
            setUserProfile(null);
          }
        }
      } catch (err) {
        console.error('Session error:', err);
        setError(err instanceof Error ? err.message : 'Auth error');
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const subscription = authService.onAuthStateChange(async (user) => {
      setUser(user);
      if (user) {
        try {
          const profile = await authService.getUserProfile(user.id);
          setUserProfile(profile);
        } catch (profileError) {
          console.error('Failed to load profile on auth change:', profileError);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return { user, userProfile, loading, error };
};

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth/signin');
    }
  }, [user, loading, navigate]);

  return { user, loading };
};

export const useAdminCheck = () => {
  const { userProfile, loading } = useAuth();

  return {
    isAdmin: userProfile?.is_admin || false,
    loading,
  };
};
