// import logo from './logo.svg';
import React from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';

// Moderator
//toast
import { ToastContainer } from 'react-toastify';

// Socket
import { ConnectionProvider } from './socket/SocketConnection';
import { UserProvider } from './providers/useUser';
import Router from './routes';
import { HelmetProvider } from 'react-helmet-async';

function App() {

  return (
    // <>
    //   <ToastContainer />

    //   <Routes>
    //     {/* <Route path='/admin/login' element={<Login />} /> */}
    //     <Route path='/' element={<Login />} />
    //     {/* <Route
    //       path="/"
    //       element={
    //         userLoggedIn ? (
    //           <>
    //             {navigate('/home')}
    //             {setUserLoggedIn(false)}
    //           </>
    //         ) : (
    //           <Login setUserLoggedIn={setUserLoggedIn} />
    //         )
    //       }
    //     /> */}
    //     <Route path='/register' element={<Register />} />

    //     {/* <Route path="/admin/login" element={<Login />} /> */}
    //   </Routes>
    //   <ConnectionProvider>
    //     <Routes>
    //       {/* Moderator */}
    //       <Route path='/home' element={<Home />} />
    //       <Route path='/moderator' element={<ModeratorStats />} />
    //       <Route path='/visit-fake-users' element={<FakeSendUser />} />
    //       {/* <Route path="/*" element={<NotFoundComponent />} /> */}
    //       <Route path="/*" element={<NotFoundComponent />} />
    //     </Routes>
    //   </ConnectionProvider>
    // </>

    <>
      <ToastContainer />
      <HelmetProvider>
        <ConnectionProvider>
          <Router />
        </ConnectionProvider>
      </HelmetProvider>    </>
  );
}
const AppWrapper = () => (
  <UserProvider>
    <App />
  </UserProvider>
);
export default AppWrapper;
