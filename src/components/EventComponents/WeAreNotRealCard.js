/* eslint-disable no-unused-vars */
import {
  Card, CardMedia, CardActions, CardActionArea,
  CardContent, Box, Container, Typography,
} from '@mui/material';

import WarningSign from './ImagesForEventComponents/warning_sign.png';

function WeAreNotRealCard() {
  return (
    <Card sx={{ maxWidth: 500 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="250"
          image={WarningSign}
          alt="macaronsF"
        />
        <CardContent>
          <Typography gutterBottom variant="h6" color="error">
            Warning:
          </Typography>
          <Typography variant="body1">
            Please do not input real credit card numbers or any other sensitive
            information. This website does not process real transactions, and any
            information entered here is for demonstration purposes only.
          </Typography>
          <Typography variant="body1">
            The creator of this website is not responsible for any misunderstandings, confusion,
            or misuse arising from the content presented. Visitors are encouraged to treat the
            entire website as a simulation and not as a representation of real-world entities.
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default WeAreNotRealCard;
