import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles, styled } from '@material-ui/core/styles';
import { Button, Typography, Container, Box } from '@mui/material';
import UserFavourtiesIcon from '../../../assets/images/favourties_icon.svg';

const useStyles = makeStyles((theme) => ({
  button: {
    color: '#fff',
    backgroundColor: 'rgb(63, 81, 181)',
  },
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  maxWidth: 480,
}));

const NotFoundComponent = () => {
  const classes = useStyles();
  const [isHovered, setIsHovered] = useState(false);

  const buttonStyles = {
    backgroundColor: isHovered ? 'rgb(44, 56, 126)' : 'rgb(63, 81, 181)',
    color: '#fff',
  };

  return (
    <Container>
      <StyledContent
        style={{ textAlign: 'center', alignItems: 'center', maxWidth: 480, margin: '0 auto' }}
      >
        <Box
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            textAlign: 'center',
            minHeight: '100vh',
          }}
        >
          <Typography variant='h3' paragraph style={{color:'#000'}}>
            Sorry, page not found!
          </Typography>

          <Typography sx={{ color: 'text.secondary' }}>
            Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL? Be
            sure to check your spelling.
          </Typography>

          <Box
            component='img'
            src={UserFavourtiesIcon}
            sx={{ height: 300, mx: 'auto', my: { xs: 5, sm: 10 }, maxWidth: '100%' }}
          />

          <Button
            to='/admin/dashboard'
            size='large'
            variant='contained'
            component={RouterLink}
            className={classes.button}
            style={buttonStyles}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Go to Home
          </Button>
        </Box>
      </StyledContent>
    </Container>
  );
};

export default NotFoundComponent;
