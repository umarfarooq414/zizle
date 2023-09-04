import PropTypes from 'prop-types';
import { NavLink as RouterLink } from 'react-router-dom';
// @mui
import { Box, List, ListItemText } from '@mui/material';
//
import { StyledNavItem, StyledNavItemIcon } from './styles';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';

import { useNavigate } from 'react-router-dom';
// ----------------------------------------------------------------------

NavSection.propTypes = {
  data: PropTypes.array,
};


export default function NavSection({ data = [], ...other }) {
  let navigate = useNavigate();
  const onSendMsg = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }
  return (
    <>
      <Box {...other}>
        <List disablePadding sx={{ p: 1 }}>
          {data.map((item) => (
            <NavItem key={item.title} item={item} />
          ))}
        </List>
        <Button sx={{ border: "none", marginLeft: "15px", color: "#637381" }} variant="outlined" startIcon={<LogoutIcon />} onClick={onSendMsg}>
          Logout
        </Button>
      </Box>


    </>

  );
}

// ----------------------------------------------------------------------

NavItem.propTypes = {
  item: PropTypes.object,
};

function NavItem({ item }) {
  const { title, path, icon, info } = item;
  return (
    <StyledNavItem
      component={RouterLink}
      to={path}
      sx={{
        '&.active': {
          color: 'text.primary',
          bgcolor: 'action.selected',
          fontWeight: 'fontWeightBold',
        },
      }}
    >
      <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>

      <ListItemText disableTypography primary={title} />


      {info && info}
    </StyledNavItem>
  );
}
