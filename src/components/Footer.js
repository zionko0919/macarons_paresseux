/* eslint-disable no-unused-vars */
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Box, Grid, Typography, Container, Button, IconButton,
} from '@mui/material';
import {
  Facebook, Instagram, X as XTwitter, YouTube,
} from '@mui/icons-material';
import UserDetails from './UserDetails';
import './Footer.css';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: (theme) => (theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[400]),
        p: 3,
        mt: 'auto', // Push the footer to the bottom
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={8}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Content Disclaimer:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              The content and information provided on this website are for demonstration
              purposes only. Everything on this site, including but not limited to products,
              services, and any associated data, is not real and is intended solely to
              showcase the functionality of a React application. Any resemblance to real
              products, services, or entities is purely coincidental. This website does
              not offer genuine products or services for purchase or use. The creator of
              this website is not responsible for any misunderstandings, confusion, or misuse
              arising from the content presented. Visitors are encouraged to treat the entire
              website as a simulation and not as a representation of real-world entities.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" color="text.secondary">
              2336 Barton Springs Rd Austin, Texas
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: macarons_paresseux@gmail.com
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Phone: +1 234 567 8901
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Follow Us
            </Typography>
            <Link href="https://www.facebook.com/" color="inherit">
              <Facebook />
            </Link>
            <Link
              href="https://www.instagram.com/"
              color="inherit"
              sx={{ pl: 1, pr: 1 }}
            >
              <Instagram />
            </Link>
            <Link href="https://www.twitter.com/" color="inherit">
              <XTwitter />
            </Link>
            <Link href="https://www.youtube.com/" color="inherit">
              <YouTube />
            </Link>
          </Grid>
          <UserDetails />
        </Grid>
        <Box mt={5}>
          <Typography variant="body2" color="text.secondary" align="center">
            Copyright © Macarons Paresseux (Sean Ko)
            {' '}
            {new Date().getFullYear()}
            .
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
