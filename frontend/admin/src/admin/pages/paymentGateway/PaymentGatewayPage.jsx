import React from 'react';
import styled from '../aDatingStyle/style.module.css';
import PaymentGateway from '../../components/admin/adminBody/paymentGateway/PaymentGateway';
import AdminPanelHeader from '../../components/admin/adminHeader/AdminHeader';
import AdminLeft from '../../components/admin/adminLeft/AdminLeft';

const PaymentGatewayPage = () => {
  return (
    <div>
      <AdminPanelHeader />
      <div className={styled.adminPanelMain}>
        <div className={styled.leftpart}>
          <AdminLeft />
        </div>
        <div className={styled.rightpart}>
          <PaymentGateway />
        </div>
        <div className={styled.clear}></div>
      </div>
    </div>
  );
};

export default PaymentGatewayPage;
