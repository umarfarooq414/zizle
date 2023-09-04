import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Box } from '@mui/system';
import { Button } from '@mui/material';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import * as PaymentIntetnService from '../../../services/PaymentIntentService';

const PaymentStripe = (props) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = (event) => {
    event.preventDefault();

    const cardElement = elements.getElement(CardElement);

    PaymentIntetnService.createPaymentIntent(props.cart, 'eur')
      .then((res) => {
        return new Promise((resolve, reject) => {
          stripe
            .createPaymentMethod({
              type: 'card',
              card: cardElement,
            })
            .then((paymentMethod) => {
              const data = {
                clientSecret: res.data.client_secret,
                paymentMethodId: paymentMethod.paymentMethod.id,
              };
              resolve(data);
            })
            .catch((err) => reject(err));
        });
      })
      .then((res) => {
        return stripe.confirmCardPayment(res.clientSecret, {
          payment_method: res.paymentMethodId,
        });
      })
      .then((res) => {
        elements.getElement(CardElement).clear();
      })
      .catch((err) => {});
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{
          boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
          padding: '10px',
          backgroundColor: '#fff',
        }}
      >
        <CardElement
          options={{
            style: {
              base: {
                color: '#000',
                backgroundColor: '#fff',
                '::placeholder': {
                  color: '#000',
                },
              },
            },
          }}
        />
      </div>

      <Button
        type='submit'
        sx={{
          marginTop: '20px',
          width: '100%',
          backgroundColor: '#FF7C6D',
          color: 'white',
          // boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
          '&:hover': {
            color: 'white',
            backgroundColor: '#FF7C6D',
          },
        }}
        disabled={!stripe || !elements}
      >
        Pay
      </Button>
    </form>
  );
};

export default PaymentStripe;
