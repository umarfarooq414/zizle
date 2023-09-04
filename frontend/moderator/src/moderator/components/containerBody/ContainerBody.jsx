import React, { useEffect, useRef } from 'react';
import AnalyticsContainerLeftBody from '../analyticsContainerLeftBody/AnalyticsContainerLeftBody';
import AnalyticsContainerCenterBody from '../analyticsContainerCenterBody/AnalyticsContainerCenterBody';
import AnalyticsContainerRightBody from '../analyticsContainerRightBody/AnalyticsContainerRightBody';
import { useDispatch, useSelector } from 'react-redux';
import { getFakeUsersConversation } from '../../../store/slices/moderatorApi/actions';
import { useUser } from '../../../providers/useUser';
import styled from './style.module.css';

export const ContainerBody = () => {
  const { fakeChatPartners } = useSelector((state) => state.moderatorApi);

  const dispatch = useDispatch();
  const userChatFetchecRef = useRef(false);
  const { token } = useUser();

  useEffect(() => {
    if (userChatFetchecRef.current) return;
    userChatFetchecRef.current = true;
    dispatch(
      getFakeUsersConversation({
        token,
      }),
    );
  }, []);

  return (
    <div className={styled.containerBody}>
      <>
        <div className={styled.containerBodyLeft}>
          <AnalyticsContainerLeftBody />
        </div>
        <div className={styled.containerBodyCenter}>
          <AnalyticsContainerCenterBody />
        </div>
        <div className={styled.containerBodyright}>
          <AnalyticsContainerRightBody />
        </div>
        <div className={styled.clear}></div>
      </>
    </div>
  );
};
