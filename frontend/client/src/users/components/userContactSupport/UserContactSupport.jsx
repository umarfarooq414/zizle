import React, { useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from './style.module.css';
import { customerSupport, getAllQueries } from '../../../store/slices/customerAPI/action';
import { useUser } from '../../../providers/useUser';
import { useEffect } from 'react';
import { unwrapResult } from '@reduxjs/toolkit';
import DarkModeContext from '../../../providers/DarkModeContext';

const UserContactSupport = () => {
  const { isDarkMode, setDarkMode } = useContext(DarkModeContext);
  const { token, user } = useUser();
  const [nickname, setNickname] = useState(user.userName);
  const [email, setEmail] = useState(user.email);
  const [theme, setTheme] = useState('');
  const [queries, setQueries] = useState([]);
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();

  const handleContactSupport = (e) => {
    e.preventDefault();
    const payload = {
      nickname: nickname,
      email: email,
      theme: theme,
      message: message,
      token: token,
    };

    dispatch(customerSupport(payload))
      .then(unwrapResult)
      .then((result) => {
        if (result) {
          getQueries();
        }
      });
  };

  const getQueries = () => {
    dispatch(getAllQueries())
      .then(unwrapResult)
      .then((result) => {
        setQueries(result);
      });
  };
  useEffect(() => {
    getQueries();
  }, []);

  return (
    <div>
      <div className={styled.rightContactSupport}>
        <div className={styled.mainStyled}>
          <div className={styled.rightContactSupportLeft}>
            <h1>Contact support</h1>
            <p>
              You can find the answers to some of the questions you might be asking yourself in the{' '}
              <Link to='/fqa'>Frequently Asked Questions</Link>
            </p>
            <section>
              <h3>Company</h3>
              <p>JOOZ YAZILIM BİLİŞİM TEKNOLOJİLERİ DANIŞMANLIK VE TİCARET LİMİTED ŞİRKETİ</p>
              <h3>Address</h3>
              <p>YENIGUN MAH. MEVLANA CAD. B BLOK NO:54 B/203 – MURATPAŞA</p>
              <h3>E-mail</h3>
              <p>
                <Link to='mailto:info@liebevalo.de'>info@liebevalo.de</Link>
              </p>
            </section>
          </div>
          <div
            className={`${styled.rightContactSupportRight} ${isDarkMode ? styled.darkMode : ''}`}
          >
            <div className={styled.rightContactSupportRightR}>
              <form onSubmit={(e) => handleContactSupport(e)}>
                <div className={styled.formGroupHalf}>
                  <div className={styled.formGroup}>
                    <label>Nickname</label>
                    <input
                      type='text'
                      value={nickname}
                      onChange={(e) => {
                        setNickname(e.target.value);
                      }}
                    />
                  </div>
                  <div className={styled.formGroup}>
                    <label>Email</label>
                    <input
                      type='email'
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                    />
                  </div>
                  <div className={styled.clear}></div>
                </div>
                <div className={styled.formGroup}>
                  <label>Theme</label>
                  <input
                    type='text'
                    onChange={(e) => {
                      setTheme(e.target.value);
                    }}
                  />
                </div>
                <div className={styled.formGroup}>
                  <label>Message</label>
                  <textarea
                    onChange={(e) => {
                      setMessage(e.target.value);
                    }}
                  ></textarea>
                </div>
                <div className={styled.formGroup}>
                  <button>Send</button>
                </div>
              </form>
            </div>
          </div>

          <div className={styled.clear}></div>
        </div>

        <div className={styled.mainStyled}>
          <div className={styled.rightContactSupportLeft}>
            <h2>support history</h2>
            <p>It may take up to 3 business days to respond to your request.</p>
          </div>
          <div
            className={`${styled.previousTickets} ${isDarkMode ? 'darkMode' : ''}`}
            key={'ticket'}
          >
            <div style={{ display: 'flex', fontWeight: '600' }}>
              <div className={styled.ticketItem}>Message</div>
              <div className={styled.ticketItem}>Status</div>
              <div className={styled.ticketItem}>Date</div>
            </div>
            {queries?.map((ticket, index) => (
              <div style={{ display: 'flex', wordBreak: 'break-all' }} key={'ticket' + index}>
                <div className={styled.ticketItem}>{ticket.query}</div>
                <div className={styled.ticketItem}>{ticket.status.replace('_', ' ')}</div>
                <div className={styled.ticketItem}>{ticket.createdAt.split('T')[0]}</div>
              </div>
            ))}
          </div>
          <div className={styled.clear}></div>
        </div>
      </div>
    </div>
  );
};

export default UserContactSupport;
