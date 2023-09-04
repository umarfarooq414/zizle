import React from 'react';
import './App.css';
import Login from './admin/pages/login/Login';
import Register from './admin/pages/register/Register';
import Statistics from './admin/components/admin/adminBody/statistics/Statistics';
import StatisticsOnlineDetails from './admin/components/admin/adminBody/statistics/OnlineModStats';
import StatisticsDetails from './admin/components/admin/adminBody/statistics/StatisticsDetails';
import AlleSpezialuser from './admin/components/admin/adminBody/alleSpezialuser/AlleSpezialuser';
import BulkMessages from './admin/components/admin/adminBody/bulkMessages/BulkMessages';
import Werbung from './admin/components/admin/adminBody/werbung/Werbung';
import AlleAffiliates from './admin/components/admin/adminBody/alleAffiliates/AlleAffiliates';
import SpezialUser from './admin/components/admin/adminBody/spezialuser/SpezialUser';
import FakeUser from './admin/components/admin/adminBody/fakeUser/FakeUser';
import CreateFakeUser from './admin/components/admin/adminBody/createFakeUser/CreateFakeUser';
import AdmimnSubscription from './admin/components/admin/adminBody/adminSubscription/AdminSubscription';
import AdminCreateSubscription from './admin/components/admin/adminBody/adminCreateSubscription/AdminCreateSubscription';
import CoinManagement from './admin/components/admin/adminBody/coinManagement/CoinManagement';
import CoinManagementCreated from './admin/components/admin/adminBody/coinManagementCreated/CoinManagementCreated';
import GiftScreen from './admin/components/admin/adminBody/giftScreen/GiftScreen';
import GiftScreenCreate from './admin/components/admin/adminBody/giftScreenCreate/GiftScreenCreate';
import BonusCodes from './admin/components/admin/adminBody/bonusCodes/BonusCodes';
import CreateBonusCode from './admin/components/admin/adminBody/createBonusCode/CreateBonusCode';
import Moderator from './admin/components/admin/adminBody/moderator/Moderator';
import CreateModerator from './admin/components/admin/adminBody/createModerator/CreateModerator';
import AdminDashboard from './admin/components/admin/adminBody/adminDashboard/AdminDashboard';
import AdminUserList from './admin/components/admin/adminBody/adminUserList/AdminUserList';
// import ModGalleryPage from './admin/pages/modGallery/ModGalleryPage';
import PageNotFound from './admin/pages/404Page/404Page.jsx';
// import Queries from "./admin/pages/Queries/Queries.jsx"
// Socket
import ModeratorMonitor from './admin/pages/moderatorMonitor/moderatorMonitor';
import StaticMessage from './admin/pages/news/staticMessagesPage/staticMessage';
import MultiMessage from './admin/pages/news/multiMessagePage/multiMessage';

// Moderator
// import Home from './moderator/pages/home/Home';

// import NotFoundComponent from './moderator/pages/404Page/404Page';

import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useUser } from './providers/useUser';
import Queries from './admin/components/admin/adminBody/queries/queries';
import ModGallery from './admin/components/admin/adminBody/modGallery/ModGallery';

const AppRouter = () => {
  // const { token } = useUser()
  const token = localStorage.getItem('token');
  const location = useLocation();

  const checkIsProtected = (isProtected, fallbackPath) => {
    if (isProtected && !token) {
      return <Navigate to={fallbackPath} replace />;
    }

    return null;
  };

  const handleLoginRedirect = () => {
    if (token && (location.pathname === '/' || location.pathname === '/register')) {
      return <Navigate to='/admin/dashboard' replace />;
    }

    return <Navigate to='/admin/dashboard' replace />;
  };

  return (
    <Routes>
      {/* <Route path="/register" element={<Register />} /> */}

      <Route
        path='/'
        element={
          <>
            {/* {handleLoginRedirect()} */}
            <Login />
          </>
        }
      />
      {/* <Route path='/admin/register' element={
        <>
          {handleLoginRedirect()}
          <Register />
        </>
      }
      /> */}
      <Route
        path='/admin/dashboard'
        element={
          <>
            {checkIsProtected(true, '/')}

            <AdminDashboard />
          </>
        }
      />
      <Route
        path='/admin/statistics'
        element={
          <>
            {checkIsProtected(true, '/')}
            <Statistics />
          </>
        }
      />
      <Route
        path='/admin/online/users'
        element={
          <>
            {checkIsProtected(true, '/')}
            <StatisticsOnlineDetails />
          </>
        }
      />
      <Route
        path='/admin/user'
        element={
          <>
            {checkIsProtected(true, '/')}
            <AdminUserList />
          </>
        }
      />
      <Route
        path='/admin/statistics/details'
        element={
          <>
            {checkIsProtected(true, '/')}
            <StatisticsDetails />
          </>
        }
      />
      <Route
        path='/admin/alle-spezialuser'
        element={
          <>
            {checkIsProtected(true, '/')}
            <AlleSpezialuser />
          </>
        }
      />
      <Route
        path='/admin/bulk-messages'
        element={
          <>
            {checkIsProtected(true, '/')}
            <BulkMessages />
          </>
        }
      />
      <Route
        path='/admin/moderator-monitor'
        element={
          <>
            {checkIsProtected(true, '/')}
            <ModeratorMonitor />
          </>
        }
      />
      <Route
        path='/admin/werbung'
        element={
          <>
            {checkIsProtected(true, '/')}
            <Werbung />
          </>
        }
      />
      <Route
        path='/admin/alle-affiliates'
        element={
          <>
            {checkIsProtected(true, '/')}
            <AlleAffiliates />
          </>
        }
      />
      <Route
        path='/admin/spezialUser'
        element={
          <>
            {checkIsProtected(true, '/')}
            <SpezialUser />
          </>
        }
      />
      <Route
        path='/admin/static-message'
        element={
          <>
            {checkIsProtected(true, '/')}
            <StaticMessage />
          </>
        }
      />
      <Route
        path='/admin/multi-message'
        element={
          <>
            {checkIsProtected(true, '/')}
            <MultiMessage />
          </>
        }
      />
      <Route
        path='/admin/fake-user'
        element={
          <>
            {checkIsProtected(true, '/')}
            <FakeUser />
          </>
        }
      />
      <Route
        path='/admin/create-fakeuser'
        element={
          <>
            {checkIsProtected(true, '/')}
            <CreateFakeUser />
          </>
        }
      />
      <Route
        path='/admin/subscription-list'
        element={
          <>
            {checkIsProtected(true, '/')}
            <AdmimnSubscription />
          </>
        }
      />
      <Route
        path='/admin/create-subscription'
        element={
          <>
            {checkIsProtected(true, '/')}
            <AdminCreateSubscription />
          </>
        }
      />
      <Route
        path='/admin/coin-management'
        element={
          <>
            {checkIsProtected(true, '/')}
            <CoinManagement />
          </>
        }
      />
      <Route
        path='/admin/create-coin-management'
        element={
          <>
            {checkIsProtected(true, '/')}
            <CoinManagementCreated />
          </>
        }
      />
      <Route
        path='/admin/gift-screen'
        element={
          <>
            {checkIsProtected(true, '/')}
            <GiftScreen />
          </>
        }
      />
      <Route
        path='/admin/create-gift-screen'
        element={
          <>
            {checkIsProtected(true, '/')}
            <GiftScreenCreate />
          </>
        }
      />
      <Route
        path='/admin/bonus-codes'
        element={
          <>
            {checkIsProtected(true, '/')}
            <BonusCodes />
          </>
        }
      />
      <Route
        path='/admin/create-bonus-code'
        element={
          <>
            {checkIsProtected(true, '/')}
            <CreateBonusCode />
          </>
        }
      />
      <Route
        path='/admin/moderator'
        element={
          <>
            {checkIsProtected(true, '/')}
            <Moderator />
          </>
        }
      />
      <Route
        path='/admin/create-moderator'
        element={
          <>
            {checkIsProtected(true, '/')}
            <CreateModerator />
          </>
        }
      />
      <Route
        path='/admin/all-mod-gallery'
        element={
          <>
            {checkIsProtected(true, '/')}
            <ModGallery />
          </>
        }
      />
      <Route path='/admin/queries' element={<Queries />} />

      {/* <Route path="/*" element={<NotFoundComponent />} /> */}
      <Route path='/*' element={<PageNotFound />} />
    </Routes>
  );
};

export default AppRouter;
