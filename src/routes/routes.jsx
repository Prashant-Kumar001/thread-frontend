import React, { lazy, Suspense } from 'react';
import { useRoutes, Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import Header from '../components/layout/Header';
import PrivateRoute from '../routes/PrivateRoute';

const Login           = lazy(() => import('../pages/Login'));
const Register        = lazy(() => import('../pages/Register'));
const Home            = lazy(() => import('../pages/Home'));
const Search          = lazy(() => import('../pages/Search'));
const ThreadDetail    = lazy(() => import('../pages/ThreadDetailView'));
const ProfileLayout   = lazy(() => import('../pages/profile/ProfileLayout'));
const Threads         = lazy(() => import('../pages/profile/Threads'));
const Replies         = lazy(() => import('../pages/profile/Replies'));
const Repost          = lazy(() => import('../pages/profile/Repost'));
const NotFound        = lazy(() => import('../pages/NotFound'));

const Loader80vh = () => (
  <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
    <CircularProgress role="status" aria-label="Loading" />
  </Box>
);

const PrivateLayout = () => (
  <Box>
    <Header />
    <Suspense fallback={<Loader80vh />}>
      <Outlet />
    </Suspense>
  </Box>
);

const PublicLayout = () => (
  <Suspense fallback={<Loader80vh />}>
    <Outlet />
  </Suspense>
);

export default function AppRoutes() {
  return useRoutes([
    {
      element: (
        <PrivateRoute>
          <PrivateLayout />
        </PrivateRoute>
      ),
      children: [
        { path: '/',                element: <Home /> },
        { path: '/search',          element: <Search /> },
        { path: '/:username/:threadId', element: <ThreadDetail /> },
        {
          path: '/:username',
          element: <ProfileLayout />,
          children: [
            { path: 'threads',  element: <Threads /> },
            { path: 'replies',  element: <Replies /> },
            { path: 'repost',   element: <Repost /> },
            { path: '*',        element: <NotFound /> },
          ],
        },
      ],
    },
    {
      element: <PublicLayout />,
      children: [
        { path: '/login',    element: <Login /> },
        { path: '/register', element: <Register /> },
      ],
    },
    { path: '*', element: <NotFound /> },
  ]);
}