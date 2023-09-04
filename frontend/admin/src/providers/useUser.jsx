/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable-next-line no-unused-vars*/
import { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from 'react-use';
const UserContext = createContext();

export const UserProvider = (props) => {
  const [token, setToken] = useLocalStorage('token', localStorage.getItem("token"), { raw: true });
  const [loggedInUser, setLoggedInUser] = useLocalStorage('user', localStorage.getItem("user"));

  const value = {
    token,
    setToken,
    loggedInUser,
    setLoggedInUser,
  };
  return (
    <>
      <UserContext.Provider value={value} {...props} />
    </>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
