import { Navigate, useRoutes } from 'react-router-dom';

import UserMainRegister from '../src/users/pages/userMainRegister/UserMainRegister';
// import User from '../src/users/pages/User/User.jsx';
import Page404 from '../src/users/pages/page404/Page404';
// import Setting from '../src/users/pages/Setting/Setting';
import Profile from '../src/users/pages/profile/Profile';
import UserHome from '../src/users/pages/userHome/UserHome';
import PaymentStripe from './users/components/paymentStripe/PaymentStripe';
import ProfileVisit from '../src/users/pages/userProfileVisitor/ProfileVisit';
import UserFavourites from '../src/users/pages/userFavourites/UserFavourites';
import UserAnnoucements from '../src/users/pages/userAnnoucements/UserAnnoucements';
import DataProtection from '../src/users/pages//dataprotaction/DataProtection';
import TermOfUse from '../src/users/pages/termofuse/TermOfUse';
import Imprint from '../src/users/pages/imprint/Imprint';
import Subscription from '../src/users/pages/subscription/Subscription';
import Subscriptionpurchased from '../src/users/pages/subscriptionPurchased/Subscription';
import FQA from '../src/users/pages/fqa/FQA';
import ContactSupport from '../src/users/pages/contactSupport/ContactSupport';
import PaymentMethodScreen from '../src/users/pages/paymentScreen/PaymentScreen';
import RandomUser from '../src/users/pages/randomUsers/RandomUser';
import BlockPage from '../src/users/pages/blockPage/BlockPage';
// import ProtectedRoutes from './users/authProtectedRoutes/ProtectedRoutes';
// import AuthRoutes from './users/authProtectedRoutes/AuthRoutes';
import HomeUserInner from './users/components/homeUserInner/HomeUserInner';
import PageWrapper from './users/components/userLeftContent/UserLeftContent';
import { useUser } from './providers/useUser';
import UserMainSocialRegister from './users/components/userMainRegister/UserMainSocialRegister';
import PaymentPayPal from './users/components/paymentPayPal/PaymentPayPal';
import FaqLogin from './users/pages/faqLogin/FaqLogin';
import UserResetPasswords from './users/pages/userMainResetPassword/UserResetPassword';
// ----------------------------------------------------------------------

export default function Router() {
  const { token } = useUser();
  // const token = localStorage.getItem('token');
  // const token = localStorage.getItem('token');
  const routes = useRoutes([
    {
      path: '/login',
      element: <UserMainRegister />,
    },
    {
      path: '/userSocialRegister',
      element: <UserMainSocialRegister />,
    },
    {
      path: '/imprint',
      element: <Imprint />,
    },
    {
      path: '/data-protection',
      element: <DataProtection />,
    },
    {
      path: '/term-of-use',
      element: <TermOfUse />,
    },
    {
      path: '/faqs',
      element: <FaqLogin />,
    },
    {
      path: '/auth/reset-password',
      element: <UserResetPasswords />,
    },
    {
      element: <PageWrapper />,
      children: [
        // { path: 'imprint', element: <Imprint /> },
        // { path: 'data-protection', element: <DataProtection /> },
        // { path: 'term-of-use', element: <TermOfUse /> },
        { path: '/', element: <UserMainRegister /> },
        { element: token === null ? <UserMainRegister /> : <UserHome /> },
        { path: 'userHome', element: <UserHome /> },
        { path: 'paymentStripe', element: token !== null ? <PaymentStripe /> : <Page404 /> },
        { path: 'paymentPayPal', element: token !== null ? <PaymentPayPal /> : <Page404 /> },
        { path: 'userAnnoucements', element: token !== null ? <UserAnnoucements /> : <Page404 /> },
        { path: 'userFavourites', element: token !== null ? <UserFavourites /> : <Page404 /> },
        { path: 'userProfileVisitor', element: token !== null ? <ProfileVisit /> : <Page404 /> },
        { path: 'subscription', element: token !== null ? <Subscription /> : <Page404 /> },
        {
          path: 'subscriptionpurchased',
          element: token !== null ? <Subscriptionpurchased /> : <Page404 />,
        },
        { path: 'profile', element: token !== null ? <Profile /> : <Page404 /> },
        { path: 'profile/:id', element: token !== null ? <HomeUserInner /> : <Page404 /> },
        { path: 'block-members', element: token !== null ? <BlockPage /> : <Page404 /> },
        { path: 'fqa', element: token !== null ? <FQA /> : <Page404 /> },
        { path: 'contact-support', element: token !== null ? <ContactSupport /> : <Page404 /> },
        {
          path: 'payment-method-screen',
          element: token !== null ? <PaymentMethodScreen /> : <Page404 />,
        },
        { path: 'random-user', element: token !== null ? <RandomUser /> : <Page404 /> },
      ],
    },
    {
      path: '/*',
      element: <Page404 />,
    },
    {
      path: '/logout',
      element: <UserMainRegister />,
    },
  ]);

  return routes;
}
