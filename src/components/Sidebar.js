/* eslint-disable no-unused-vars */
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  Drawer, Box, Button, List, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText,
} from '@mui/material';
import { ArrowRight } from '@mui/icons-material/';
import UserDetails from './UserDetails';
import './Sidebar.css';

function Sidebar({ isSidebarOpen, onClose }) {
  const list = (right) => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
    >
      <List>
        {['Menu', 'Order Now', 'News'].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton type="button" />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Drawer
      anchor="right"
      open={isSidebarOpen}
      onClose={onClose}
    >
      <div className="sidebar-component">
        <Box
          sx={{ width: 250 }}
          role="presentation"
        >
          <List>
            <ListItemButton onClick={onClose}>
              <ListItemIcon>
                <ArrowRight />
              </ListItemIcon>
            </ListItemButton>
            <Link to="ordernow">
              <ListItemButton>
                <Button type="button" onClick={onClose}>Order Now</Button>
              </ListItemButton>
            </Link>
            <Link to="all_menu">
              <ListItemButton>
                <Button type="button" onClick={onClose}>Menu</Button>
              </ListItemButton>
            </Link>
            <Link to="#ToDo">
              <ListItemButton>
                <Button type="button" onClick={onClose}>News</Button>
              </ListItemButton>
            </Link>
          </List>
        </Box>
      </div>
    </Drawer>
  );
}

Sidebar.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Sidebar;
