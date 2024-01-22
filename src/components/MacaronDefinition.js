/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import {
  Card, CardMedia, CardActions, CardActionArea, CardContent, Box, Container,
  Typography, Button, ImageList, ImageListItem, Grid,
} from '@mui/material';
import './MacaronDefinition.css';
import macaronsA from '../images/macaron_random_images/macarons_A.png';
import macaronsB from '../images/macaron_random_images/macarons_B.png';
import macaronsC from '../images/macaron_random_images/macarons_C.png';
import macaronsD from '../images/macaron_random_images/macarons_D.png';
import macaronsE from '../images/macaron_random_images/macarons_E.png';
import macaronsF from '../images/macaron_random_images/macarons_F.png';
import macaronsG from '../images/macaron_random_images/macarons_G.png';
import macaronsH from '../images/macaron_random_images/macarons_H.png';
import macaronsI from '../images/macaron_random_images/macarons_I.png';
import macaronsJ from '../images/macaron_random_images/macarons_J.png';
import macaronsK from '../images/macaron_random_images/macarons_K.png';
import macaronsL from '../images/macaron_random_images/macarons_L.png';
import macaronsM from '../images/macaron_random_images/macarons_M.png';
import macaronsN from '../images/macaron_random_images/macarons_N.png';
import macaronsO from '../images/macaron_random_images/macarons_O.png';

const imageData = [
  { img: macaronsA, featured: true },
  { img: macaronsB },
  { img: macaronsC },
  { img: macaronsD },
  { img: macaronsE },
  { img: macaronsF, featured: true },
  { img: macaronsG },
  { img: macaronsH },
  { img: macaronsI },
  { img: macaronsJ },
  { img: macaronsK, featured: true },
  { img: macaronsL },
  { img: macaronsM },
  { img: macaronsN },
  { img: macaronsO },
];

function srcset(image, width, height, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${width * cols}&h=${height * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${width * cols}&h=${
      height * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  };
}

function MacaronDefinition() {
  return (
    <Card sx={{ maxWidth: 500 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="250"
          image={macaronsF}
          alt="macaronsF"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" sx={{ fontFamily: 'pacifico' }}>
            MA &bull;CA &bull;RON
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            : a light, often brightly colored sandwich cookie consisting of two rounded
            disks made from a batter of egg whites, sugar, and almond flour surrounding
            a sweet filling
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default MacaronDefinition;
