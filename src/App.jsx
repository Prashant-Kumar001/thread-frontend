import { Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import Header from './components/layout/Header';
import PrivateRoute from './routes/PrivateRoute';
import { useEffect, useState, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from './redux/features/authSlice';





const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Home = lazy(() => import('./pages/Home'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Search = lazy(() => import('./pages/Search'));
const ProfileLayout = lazy(() => import('./pages/profile/ProfileLayout'));
const Threads = lazy(() => import('./pages/profile/Threads'));
const Replies = lazy(() => import('./pages/profile/Replies'));
const Repost = lazy(() => import('./pages/profile/Repost'));
const ThreadDetailView = lazy(() => import('./pages/ThreadDetailView'));

import ErrorBoundary from './ErrorBoundary';

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { accessToken, user } = useSelector((state) => state.auth);
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_CONNECTOR}/api/v1/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          dispatch(setCredentials(data));
        }
      } catch (err) {
        console.error('Refresh token failed:', err);
      } finally {
        setLoading(false);
      }
    };

    refreshAccessToken();
  }, [dispatch]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
        <Typography ml={2}>Checking session...</Typography>
      </Box>
    );
  }

  return (
    <ErrorBoundary>
      <Box>
        {!isAuthPage && <Header />}
        <Suspense
          fallback={
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
              <CircularProgress />
            </Box>
          }
        >
          <Routes>
            <Route element={<PrivateRoute accessToken={accessToken}><Outlet /></PrivateRoute>}>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
               <Route path=":username/:threadId" element={<ThreadDetailView />} />
              <Route path="/:username" element={<ProfileLayout />}>
                <Route path="threads" element={<Threads />} />
                <Route path="replies" element={<Replies />} />
                <Route path="repost" element={<Repost />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Box>
    </ErrorBoundary>
  );
}

export default App;
