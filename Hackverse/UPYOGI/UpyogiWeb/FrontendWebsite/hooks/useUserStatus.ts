import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface UserStatus {
  exists: boolean;
  test1_completed: boolean;
  test2_completed: boolean;
  onboarding_completed: boolean;
  dosha_type?: string;
  next_step: string;
  profile?: {
    id: number;
    email: string;
    full_name: string;
    created_at: string;
  };
}

export function useUserStatus() {
  const { user } = useAuth();
  const [status, setStatus] = useState<UserStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserStatus = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/user/status?userId=${user.uid}`);
        
        if (response.ok) {
          const data = await response.json();
          setStatus(data);
          setError(null);
        } else {
          throw new Error('Failed to fetch user status');
        }
      } catch (err) {
        console.error('Error fetching user status:', err);
        setError('Failed to load user status');
      } finally {
        setLoading(false);
      }
    };

    fetchUserStatus();
  }, [user]);

  const getRedirectPath = (): string => {
    if (!status) return '/dashboard';
    return status.next_step;
  };

  const needsOnboarding = (): boolean => {
    return status ? !status.onboarding_completed : true;
  };

  const needsTest1 = (): boolean => {
    return status ? !status.test1_completed : true;
  };

  const needsTest2 = (): boolean => {
    return status ? !status.test2_completed : true;
  };

  return {
    status,
    loading,
    error,
    getRedirectPath,
    needsOnboarding,
    needsTest1,
    needsTest2
  };
}
