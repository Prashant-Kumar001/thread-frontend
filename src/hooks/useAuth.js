import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/features/authSlice';

export default function useAuth() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_CONNECTOR}/api/v1/auth/refresh`,
          {
            method: 'POST',
            credentials: 'include',
          }
        );
        if (res.ok) {
          const data = await res.json();
          dispatch(setCredentials(data));
        }
      } catch (err) {
        console.error('Refresh token failed:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [dispatch]);

  return loading;
}