import React, { useState, useRef, useEffect } from 'react';
import styled from './style.module.css';
import blockImage from '../../../../assets/images/block.png';
import CircularProgress from '@mui/material/CircularProgress';
import { blockModChat } from '../../../../store/slices/userAuth/actions';
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { style } from '@mui/system';

const FakeChatBody = ({
  fakeConversation,
  user: { sender, receiver },
  getFakeConversation,
  currentChatBlocked,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const chatHistoryRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchFakeConversation = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
    };

    fetchFakeConversation();
  }, []);

  const blockChat = () => {
    const {
      chat: { moderatorId },
      id,
    } = fakeConversation[fakeConversation.length - 1];
    dispatch(
      blockModChat({
        modId: moderatorId,
        chatId: id.toString(),
      }),
    )
      .then(unwrapResult)
      .then((result) => {
        setIsLoading(false);
        if (result) {
          getFakeConversation(moderatorId);
        }
      });
  };

  return (
    <div className={styled.analyticsContainerCenterBody}>
      <div className={`${styled.pageContent} ${styled.pageContainer}`} id={styled.pageContent}>
        <div className='padding'>
          <div
            className={`${styled.row} ${styled.container} ${styled.dFlex} ${styled.justifyContentCenter}`}
          >
            <div className={styled.colMd6}>
              <div className={`${styled.card} ${styled.cardBordered}`}>
                <div className={styled.farvChatDetailsHead}>
                  <h2>
                    {receiver.name} - {sender.name}
                    <span style={{ float: 'right', cursor: 'pointer', fontSize: '10px' }}>
                      {currentChatBlocked ? (
                        <div style={{ marginTop: '10px' }}>Blocked</div>
                      ) : (
                        <img
                          src={blockImage}
                          alt=''
                          className={styled.blockImg}
                          onClick={() => blockChat()}
                        />
                      )}
                    </span>
                  </h2>
                  <span>
                    {currentChatBlocked ? (
                      <button style={{ backgroundColor: '#6f6f6f', color: 'rgb(200, 189, 189)' }}>
                        Chat blocked
                      </button>
                    ) : (
                      <button onClick={() => blockChat()}>Block this chat</button>
                    )}
                  </span>
                  <div className={styled.clear}></div>
                </div>

                <div
                  className={`${styled.psContainer} ${styled.psThemeDefault} ${styled.psActiveY}`}
                  id={styled.chatContent}
                  style={{ overflowY: 'hidden' }}
                >
                  <div className={styled.farvChatDetailsBody}>
                    <div className={styled.chat_history}>
                      {isLoading ? (
                        <CircularProgress color='primary' style={{ marginLeft: '50%' }} />
                      ) : (
                        <ul>
                          {fakeConversation?.map((message, index) => (
                            <li
                              className={sender?.id === message.sender ? styled.clear : ''}
                              key={'msg' + index}
                            >
                              {sender?.id === message.sender ? (
                                <>
                                  <div
                                    className={styled.message_data}
                                    style={{ textAlign: 'left' }}
                                  >
                                    &nbsp; &nbsp;
                                    <i className={styled.circle_online}></i>
                                    <span className={styled.message_data_name}>{sender?.name}</span>
                                    <span className={styled.message_data_time}>
                                      {new Date(message.createdAt).toLocaleString()}
                                    </span>
                                  </div>

                                  {message?.attachments?.length > 0 ? (
                                    <div className={`${styled.chatMsgImg} ${styled.chatMsgImgL}`}>
                                      <img src={message.attachments[0]?.fileUrl} alt='img' />
                                    </div>
                                  ) : (
                                    <div
                                      className={`${styled.message} ${
                                        sender?.id === message.sender
                                          ? styled.my_message
                                          : styled.other_message
                                      }`}
                                    >
                                      {message?.message}
                                    </div>
                                  )}
                                </>
                              ) : (
                                receiver?.id === message.sender && (
                                  <>
                                    <div
                                      className={styled.message_data}
                                      style={{ textAlign: 'right' }}
                                    >
                                      <span className={styled.message_data_time}>
                                        {new Date(message.createdAt).toLocaleString()}
                                      </span>
                                      <i className={styled.circle_online}></i>
                                      <span className={styled.message_data_name}>
                                        {receiver?.name}
                                      </span>
                                      &nbsp; &nbsp;
                                    </div>

                                    {message?.attachments?.length > 0 ? (
                                      <div className={`${styled.chatMsgImg} ${styled.chatMsgImgR}`}>
                                        <img src={message.attachments[0]?.fileUrl} alt='img' />
                                      </div>
                                    ) : (
                                      <div
                                        className={`${styled.message} ${
                                          sender?.id === message.sender
                                            ? styled.my_message
                                            : styled.other_message
                                        }`}
                                      >
                                        {message?.message}
                                      </div>
                                    )}
                                  </>
                                )
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                      <div ref={chatHistoryRef} />
                    </div>
                  </div>

                  <div className={styled.psScrollbarXRail} style={{ left: '0px', bottom: '0px' }}>
                    <div
                      className={styled.psScrollbarX}
                      tabIndex='0'
                      style={{ left: '0px', width: '0px' }}
                    ></div>
                  </div>
                  <div
                    className={styled.psScrollbarYRail}
                    style={{ top: '0px', height: '0px', right: '2px' }}
                  >
                    <div
                      className={styled.psScrollbarY}
                      tabIndex='0'
                      style={{ top: '0px', height: '2px' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default FakeChatBody;
