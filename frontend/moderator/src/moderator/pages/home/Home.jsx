import React from 'react';
import styled from './style.module.css';
import { ContainerBody } from '../../components/containerBody/ContainerBody';
import { HeaderLeft } from '../../components/headerLeft/HeaderLeft';
import { HeaderRight } from '../../components/headerRight/HeaderRight';

const Home = () => {
  return (
    <>
      <div className={styled.mainHeader}>
        <div className={styled.wrapwidth}>
          <HeaderLeft />
          <HeaderRight />
        </div>
      </div>
      <div>
        <ContainerBody />
      </div>
    </>
  );
};
export default Home;