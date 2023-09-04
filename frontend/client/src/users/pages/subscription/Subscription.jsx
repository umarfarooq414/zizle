import React from 'react';
import SubscriptionComponents from '../../components/subscriptionComponent/SubscriptionComponents';
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
