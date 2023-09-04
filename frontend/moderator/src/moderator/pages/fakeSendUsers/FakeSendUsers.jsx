import React from 'react';
import styled from './style.module.css';
import { HeaderLeft } from '../../components/headerLeft/HeaderLeft';
import { HeaderRight } from '../../components/headerRight/HeaderRight';
import ModeratorFakeSendUser from "../../components/moderatorFakeSendUser/ModeratorFakeSendUser";

const FakeSendUsers = () => {
  return (
    <>
      <div className={styled.mainHeader}>
        <div className={styled.wrapwidth}>
          <HeaderLeft />
          <HeaderRight />
        </div>
      </div>
      <div>
        <ModeratorFakeSendUser />
      </div>
    </>
  );
};
export default FakeSendUsers;