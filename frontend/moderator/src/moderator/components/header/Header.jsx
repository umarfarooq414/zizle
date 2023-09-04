import React from 'react';
import { ContainerBody } from '../containerBody/ContainerBody';
import { HeaderLeft } from '../headerLeft/HeaderLeft';
import { HeaderRight } from '../headerRight/HeaderRight';
import styled from './style.module.css';

export const Header = () => {
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
