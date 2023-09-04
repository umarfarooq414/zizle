import React from 'react';
import styled from './style.module.css';
import { HeaderLeft } from '../../components/headerLeft/HeaderLeft';
import { HeaderRight } from '../../components/headerRight/HeaderRight';
import ModeratorContainerBodyStats from '../../components/moderatorContainerBodyStats/ModeratorContainerBodyStats';

const ModeratorStats = () => {

  return (
    <>
      <div className={styled.mainHeader}>
        <div className={styled.wrapwidth}>
          <HeaderLeft />
          <HeaderRight />
        </div>
      </div>
      <div>
        <ModeratorContainerBodyStats />
      </div>
    </>
  );
};
export default ModeratorStats;