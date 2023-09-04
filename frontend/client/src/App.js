import React, { useContext, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { purple } from '@material-ui/core/colors';
import { ToastContainer } from 'react-toastify';
import { UserProvider } from './providers/useUser';
import { ConnectionProvider } from './socket/SocketConnection';
import Router from './routes';
import { GlobalModal } from './globalPopups/GlobalModal';
import DarkModeContext from './providers/DarkModeContext';
import { DarkModeProvider } from './providers/DarkModeContext';

let App = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      background: {
        default: isDarkMode ? '#000000' : '#ffffff',
      },
      text: {
        primary: isDarkMode ? '#ffffff' : '#000000',
      },
      primary: {
        main: isDarkMode ? '#f50057' : '#3f51b5',
      },
      secondary: {
        main: isDarkMode ? '#ffffff' : '#000000',
      },
    },
  });
  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer />
      <ConnectionProvider>
        <Router />
      </ConnectionProvider>
    </ThemeProvider>
  );
};

const AppWrapper = () => (
  <UserProvider>
    <DarkModeProvider>
      <GlobalModal>
        <App />
      </GlobalModal>
    </DarkModeProvider>
  </UserProvider>
);

export default AppWrapper;
