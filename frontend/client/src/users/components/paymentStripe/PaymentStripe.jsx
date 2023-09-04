import React, { useContext } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Box } from '@mui/system';
import StripeCheckoutForm from '../stripeCheckoutForm/StripeCheckoutForm';
import { useLocation } from 'react-router-dom';
import DarkModeContext from '../../../providers/DarkModeContext';
const stripePromise = loadStripe(
  'pk_test_51MucYBIV9M9aqYDu4CPE8deK8t8xs0DVuNe1JKk14jXesD7kaE6AB78btzmunmm0G82BpMcYMdv5HA2OmqdsOG1S00PqM2hCfE',
);

const PaymentStripe = ({ route, navigate }) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const location = useLocation();
  const cart = [location.state.item];

  return (
    <Box
      sx={{
        color: '#000 !important',
        backgroundColor: isDarkMode ? '#4f4242' : '#fff',
        padding: '16px 16px',
      }}
    >
      <Elements stripe={stripePromise}>
        <StripeCheckoutForm cart={cart} />
      </Elements>
    </Box>
  );
};

export default PaymentStripe;
