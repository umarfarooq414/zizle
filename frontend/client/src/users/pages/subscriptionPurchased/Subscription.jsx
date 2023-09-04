import React from 'react';
import SubscriptionComponents from '../../components/subscriptionPurchasedComponent/SubscriptionpurchasedComponents';
import UserHeaderButtons from '../../components/userHeaderButtons/UserHeaderButtons';
import UserHeaderLogo from '../../components/userHeaderLogo/UserHeaderLogo';
import UserLeftContent from '../../components/userLeftContent/UserLeftContent';
import styled from './style.module.css';

const Subscription = () => {
  return (
    <div className={styled.UserLeftNavigation}>
      <SubscriptionComponents />
    </div>
  );
};

export default Subscription;
