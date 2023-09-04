import React from 'react';
import './App.css';

// Moderator
import Home from './moderator/pages/home/Home';
import ModeratorStats from './moderator/pages/moderatorStatistics/ModeratorStats';
import FakeSendUser from './moderator/pages/fakeSendUsers/FakeSendUsers';

import Login from './moderator/components/login/Logins';

import { useUser } from './providers/useUser';

import NotFoundComponent from './moderator/pages/404Page/404Page';

import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

const AppRouter = () => {
  const { token } = useUser();
  const location = useLocation();

  const checkIsProtected = (isProtected, fallbackPath) => {
    if (isProtected && !token) {
      return <Navigate to={fallbackPath} replace />;
    }

    return null;
  };

  const handleLoginRedirect = () => {
    if (token && (location.pathname === '/' || location.pathname === '/register')) {
      return <Navigate to='/home' replace />;
    }

    return null;
  };

  return (
    <Routes>
      <Route
        path='/'
        element={
          <>
            {/* {handleLoginRedirect()} */}
            <Login />
          </>
        }
      />
      {/* <Route path="/register" element={<Register />} /> */}

      <Route
        path='/home'
        element={
          <>
            {checkIsProtected(true, '/')}
            <Home />
          </>
        }
      />

      <Route
        path='/moderator'
        element={
          <>
            {checkIsProtected(true, '/')}
            <ModeratorStats />
          </>
        }
      />

      <Route
        path='/visit-fake-users'
        element={
          <>
            {checkIsProtected(true, '/')}
            <FakeSendUser />
          </>
        }
      />

      <Route path='/*' element={<NotFoundComponent />} />
    </Routes>
  );
};

export default AppRouter;
