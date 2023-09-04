// import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// export default function PaymentPayPal() {
//   const clientId = process.env.REACT_PAYPAL_CLIENT_ID;
//   return (
//     <PayPalScriptProvider options={{ "client-id": "AbOF_yTSKNvDeT68t2nTqaRsmDHHRU8cnBAj3LFEhvzMuYgimSbEBq58hG-b_lWdfAFUrCAk_0aLMuX0" }}>
//       <PayPalButtons style={{ layout: "vertical" }} />
//     </PayPalScriptProvider>
//   );
// }

import { useEffect } from 'react';
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import { useLocation } from 'react-router-dom';
// This values are the props in the UI
const currency = 'USD';
const style = { layout: 'vertical' };

// Custom component to wrap the PayPalButtons and handle currency changes
const ButtonWrapper = ({ currency, showSpinner }) => {
  const location = useLocation();
  const paramValues = location.state.item;
  const amount = paramValues.amount;
  // usePayPalScriptReducer can be use only inside children of PayPalScriptProviders
  // This is the main reason to wrap the PayPalButtons in a new component
  const [{ options, isPending }, dispatch] = usePayPalScriptReducer();

  useEffect(() => {
    dispatch({
      type: 'resetOptions',
      value: {
        ...options,
        currency: currency,
      },
    });
  }, [currency, showSpinner]);

  return (
    <>
      {showSpinner && isPending && <div className='spinner' />}
      <PayPalButtons
        style={style}
        disabled={false}
        forceReRender={[amount, currency, style]}
        fundingSource={undefined}
        createOrder={(data, actions) => {
          return actions.order
            .create({
              purchase_units: [
                {
                  amount: {
                    currency_code: currency,
                    value: amount,
                  },
                },
              ],
            })
            .then((orderId) => {
              // Your code here after create the order
              return orderId;
            });
        }}
        onApprove={function (data, actions) {
          return actions.order.capture().then(function () {
            // Your code here after capture the order
          });
        }}
      />
    </>
  );
};

export default function App() {
  return (
    <div style={{ maxWidth: '750px', minHeight: '200px' }}>
      <PayPalScriptProvider
        options={{
          'client-id':
            'AbOF_yTSKNvDeT68t2nTqaRsmDHHRU8cnBAj3LFEhvzMuYgimSbEBq58hG-b_lWdfAFUrCAk_0aLMuX0',
          components: 'buttons',
          currency: 'USD',
        }}
      >
        <ButtonWrapper currency={currency} showSpinner={false} />
      </PayPalScriptProvider>
    </div>
  );
}
