/* eslint-disable no-unused-vars */
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Box, Grid, Text, Button, IconButton,
} from '@radix-ui/themes';
import UserDetails from './UserDetails';
import './Footer.css';
import instagramLogo from '../images/social_media_icons/instagram_icon.png';
import youtubeLogo from '../images/social_media_icons/youtube_icon.png';
import facebookLogo from '../images/social_media_icons/facebook_icon.png';
import pinIcon from '../images/social_media_icons/pin_icon.png';

function Footer() {
  return (
    <>
      <Grid columns="2" gap="9" width="auto" height="auto">
        <Box height="auto">
          <Text as="div" className="content-disclaimer">
            <Text as="p">Content Disclaimer:</Text>
            <Text as="p">
              The content and information provided on this website are
              for demonstration purposes only. Everything on this site,
              including but not limited to products, services, and any
              associated data, is not real and is intended solely to showcase
              the functionality of a React application.
              Any resemblance to real products, services, or entities is
              purely coincidental. This website does not offer genuine
              products or services for purchase or use.
              The creator of this website is not responsible for any misunderstandings, confusion,
              or misuse arising from the content presented. Visitors are encouraged to treat the
              entire website as a simulation and not as a representation of real-world entities.
            </Text>
          </Text>
        </Box>
        <Box height="auto">
          <Grid columns="1" width="auto" height="auto">
            <Box height="auto">
              <Grid columns="3" gap="9" width="auto" height="auto">
                <IconButton type="button" variant="ghost">
                  <img src={instagramLogo} alt="instagram logo" width="50" />
                </IconButton>
                <IconButton type="button" variant="ghost">
                  <img src={youtubeLogo} alt="instagram logo" width="50" />
                </IconButton>
                <IconButton type="button" variant="ghost">
                  <img src={facebookLogo} alt="instagram logo" width="50" />
                </IconButton>
              </Grid>
            </Box>
          </Grid>
          <Text as="div" className="footer-address-info">
            2336 Barton Springs Rd
            Austin, Texas
          </Text>
          <IconButton type="button" variant="ghost">
            <a href="https://maps.app.goo.gl/LkaUGA6TGQrRsVFV7" target="_blank" rel="noopener noreferrer">
              <img src={pinIcon} alt="pin icon" width="30" />
            </a>
          </IconButton>
          <Text as="div" className="footer-contact-info">
            EMAIL: macarons_paresseux@gmail.com
          </Text>
          <UserDetails />
        </Box>
      </Grid>
      <Box height="auto">
        <Text as="div" className="copyright-statement">
          Copyright ©
          {' '}
          {new Date().getFullYear()}
          {' '}
          Macarons Paresseux and Sean Ko
        </Text>
      </Box>
    </>
  );
}

export default Footer;
