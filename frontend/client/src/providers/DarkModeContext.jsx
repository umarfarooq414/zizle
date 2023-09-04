import React, { createContext, useState, useEffect, useContext } from 'react';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const DarkModeContext = createContext();
const theme = createMuiTheme({
  darkMode: {
    background: '#000000', // black
    text: '#ffffff', // white
  },
  // rest of your theme
});

export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setDarkMode] = useState(() => {
    try {
      const savedDarkMode = localStorage.getItem('darkMode');
      return savedDarkMode !== null ? JSON.parse(savedDarkMode) : false;
    } catch (error) {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, setDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export default DarkModeContext;

export const useDarkMode = () => useContext(DarkModeContext);
