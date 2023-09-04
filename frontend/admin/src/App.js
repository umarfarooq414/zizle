import React from 'react';
import './App.css';

import { ToastContainer } from 'react-toastify';
import { HelmetProvider } from 'react-helmet-async';
import Router from './routes';
import { UserProvider } from './providers/useUser';
function App() {

  return (
    // <>
    //   <ToastContainer />

    //   <Routes>
    //     <Route path="/" element={<Login />} />
    //     <Route path='/admin/register' element={<Register />} />
    //     <Route path='/admin/dashboard' element={<AdminDashboard />} />
    //     <Route path='/admin/statistics' element={<Statistics />} />
    //     <Route path='/admin/online/users' element={<StatisticsOnlineDetails />} />
    //     <Route path='/admin/user' element={<AdminUserList />} />
    //     <Route path='/admin/statistics/details' element={<StatisticsDetails />} />
    //     <Route path='/admin/alle-spezialuser' element={<AlleSpezialuser />} />
    //     <Route path='/admin/bulk-messages' element={<BulkMessages />} />
    //     <Route path='/admin/moderator-monitor' element={<ModeratorMonitor />} />
    //     <Route path='/admin/werbung' element={<Werbung />} />
    //     <Route path='/admin/alle-affiliates' element={<AlleAffiliates />} />
    //     <Route path='/admin/spezialUser' element={<SpezialUser />} />
    //     <Route path='/admin/static-message' element={<StaticMessage />} />
    //     <Route path='/admin/multi-message' element={<MultiMessage />} />
    //     <Route path='/admin/fake-user' element={<FakeUser />} />
    //     <Route path='/admin/create-fakeuser' element={<CreateFakeUser />} />
    //     <Route path='/admin/subscription-list' element={<AdmimnSubscription />} />
    //     <Route path='/admin/create-subscription' element={<AdminCreateSubscription />} />
    //     <Route path='/admin/coin-management' element={<CoinManagement />} />
    //     <Route path='/admin/create-coin-management' element={<CoinManagementCreated />} />
    //     <Route path='/admin/gift-screen' element={<GiftScreen />} />
    //     <Route path='/admin/create-gift-screen' element={<GiftScreenCreate />} />
    //     <Route path='/admin/bonus-codes' element={<BonusCodes />} />
    //     <Route path='/admin/create-bonus-code' element={<CreateBonusCode />} />
    //     <Route path='/admin/moderator' element={<Moderator />} />
    //     <Route path='/admin/create-moderator' element={<CreateModerator />} />
    //     <Route path='/admin/all-mod-gallery' element={<ModGallery />} />
    //     <Route path='*' element={<PageNotFound />} />
    //   </Routes>
    // </>


    <>

      <ToastContainer />
      <HelmetProvider>
        <Router />
      </HelmetProvider>
    </>
  );
}

export default App;
