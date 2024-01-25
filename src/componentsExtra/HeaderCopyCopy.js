/* eslint-disable no-unused-vars */
import { Link } from 'react-router-dom';
import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  AppBar, Box, Toolbar, IconButton, Typography, Badge, ButtonGroup,
  Menu, Container, Button, Tooltip, MenuItem, Avatar, ListItemButton,
} from '@mui/material';
import { ShoppingCartOutlined, MenuRounded } from '@mui/icons-material';
import GastonMacaronLogo from '../images/logos_icons/gaston_macaron_small_logo.png';
import Sidebar from '../components/Sidebar';
import CartIcon from '../images/cart.svg';
import UserDetails from '../components/UserDetails';
import '../components/Header.css';

function Header({ cart }) {
  const [isNavBar, setIsNavBar] = useState(null);

  const navOpenHandler = (event) => {
    setIsNavBar(event.currentTarget);
  };

  const navCloseHandler = () => {
    setIsNavBar(null);
  };

  const cartQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <AppBar position="static" color="default" className="app-bar-component">
      <Container>
        <Toolbar disableGutters>
          {/* <Box className="logo-image-box" sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>
              <img
                src={GastonMacaronLogo}
                alt="gaston macaron logo"
                className="header-logo"
                width="90"
              />
            </Box> */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>
            <Link to="/" className="app-bar-title">
              <Typography
                variant="h3"
                noWrap
                component="a"
                href="#ToDo"
                sx={{
                  mr: 2,
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'pacifico',
                  fontWeight: 200,
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                Macarons Paresseux
              </Typography>
            </Link>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={navOpenHandler}
              color="inherit"
            >
              <MenuRounded />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={isNavBar}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(isNavBar)}
              onClose={navCloseHandler}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem
                onClick={navCloseHandler}
              >
                <Button
                  type="button"
                  as={Link}
                  to="/all_menu"
                  variant="text"
                  sx={{
                    my: 1,
                    color: 'inherit',
                    display: 'block',
                    textDecoration: 'none',
                  }}
                >
                  <Typography
                    textAlign="center"
                    color="inherit"
                    sx={{
                      variant: 'p',
                      fontFamily: 'pacifico',
                      fontSize: 20,
                    }}
                  >
                    Macarons
                  </Typography>
                </Button>
              </MenuItem>
              <MenuItem
                onClick={navCloseHandler}
              >
                <Button
                  type="button"
                  as={Link}
                  to="/ordernow"
                  variant="text"
                  sx={{
                    my: 1,
                    color: 'inherit',
                    display: 'block',
                    textDecoration: 'none',
                  }}
                >
                  <Typography
                    textAlign="center"
                    color="inherit"
                    sx={{
                      variant: 'p',
                      fontFamily: 'pacifico',
                      fontSize: 20,
                    }}
                  >
                    Order Now
                  </Typography>
                </Button>
              </MenuItem>
              <MenuItem
                onClick={navCloseHandler}
              >
                <Button
                  type="button"
                  as={Link}
                  to="#ToDo"
                  variant="text"
                  sx={{
                    my: 1,
                    color: 'inherit',
                    display: 'block',
                    textDecoration: 'none',
                  }}
                >
                  <Typography
                    textAlign="center"
                    color="inherit"
                    sx={{
                      variant: 'p',
                      fontFamily: 'pacifico',
                      fontSize: 20,
                    }}
                  >
                    Our Story
                  </Typography>
                </Button>
              </MenuItem>
              <MenuItem>
                <Button
                  type="button"
                  as={Link}
                  to="#ToDo"
                  variant="text"
                  sx={{
                    my: 1,
                    color: 'inherit',
                    display: 'block',
                    textDecoration: 'none',
                  }}
                >
                  <Typography
                    textAlign="center"
                    color="inherit"
                    sx={{ variant: 'p', fontFamily: 'pacifico', fontSize: 40 }}
                  >
                    Contact Us
                  </Typography>
                </Button>
              </MenuItem>
            </Menu>
          </Box>
          <Typography
            variant="h3"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexDirection: 'row',
              flexGrow: 1,
              fontFamily: 'pacifico',
              fontWeight: 100,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <Link to="/" className="app-bar-title">
              Macarons Paresseux
            </Link>
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <ButtonGroup variant="outlined">
              <Button
                type="button"
                as={Link}
                to="/all_menu"
                variant="text"
                sx={{
                  my: 2,
                  color: 'inherit',
                  display: 'block',
                  textDecoration: 'none',
                  fontFamily: 'pacifico',
                  fontSize: 14,
                }}
              >
                Macarons
              </Button>
              <Button
                type="button"
                as={Link}
                to="/ordernow"
                variant="text"
                sx={{
                  my: 2,
                  color: 'inherit',
                  display: 'block',
                  textDecoration: 'none',
                  fontFamily: 'pacifico',
                  fontSize: 14,

                }}
              >
                Order Now
              </Button>
              <Button
                type="button"
                as={Link}
                to="#ToDo"
                variant="text"
                sx={{
                  my: 2,
                  color: 'inherit',
                  display: 'block',
                  textDecoration: 'none',
                  fontFamily: 'pacifico',
                  fontSize: 14,
                }}
              >
                Our Story
              </Button>
              <Button
                type="button"
                as={Link}
                to="#ToDo"
                variant="text"
                sx={{
                  my: 2,
                  color: 'inherit',
                  display: 'block',
                  textDecoration: 'none',
                  fontFamily: 'pacifico',
                  fontSize: 14,
                }}
              >
                Contact Us
              </Button>
            </ButtonGroup>
          </Box>
          <Box>
            <Link to="/cart">
              <Badge badgeContent={1} color="primary">
                <ShoppingCartOutlined fontSize="large" sx={{ color: 'black' }} />
              </Badge>
            </Link>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

Header.propTypes = {
  cart: PropTypes.arrayOf(PropTypes.shape({
    itemId: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
  })).isRequired,
};

export default Header;
