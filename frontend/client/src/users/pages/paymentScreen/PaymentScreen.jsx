import React from 'react';
import UserLeftContent from '../../components/userLeftContent/UserLeftContent';
import styled from './style.module.css';
import PaymentMethod from '../../components/paymentMethod/PaymentMethod';

const PaymentScreen = () => {
  return (
    <div className={styled.UserLeftNavigation}>
      <PaymentMethod />
    </div>
  );
};
export default PaymentScreen;
