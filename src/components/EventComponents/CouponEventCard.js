/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import {
  Card, CardMedia, CardActions, CardActionArea, CardContent, Box, Container, Typography,
} from '@mui/material';
import macaronCoupons from '../../images/card_images/macaronCoupons.png';

function CouponEventCard() {
  return (
    <Card sx={{ maxWidth: 500 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          heigth="250"
          image={macaronCoupons}
          alt="macaronCoupons"
        />
        <CardContent>
          <Container>
            <Box>
              <Typography textAlign="center">
                Promotion Codes
              </Typography>
            </Box>
            <Box>
              <Typography variant="body">
                20% Off:
                {' '}
                <strong>EVERYTHINGOFF20</strong>
              </Typography>
            </Box>
            <Box>
              <Typography variant="body">
                40% Off on $30+:
                {' '}
                <strong>BIGBIG40</strong>
              </Typography>
            </Box>
            <Box>
              <Typography variant="body">
                $5 Off:
                {' '}
                <strong>SPECIAL5</strong>
              </Typography>
            </Box>
          </Container>
        </CardContent>
      </CardActionArea>
    </Card>
  );
  // <Grid columns="2" gap="1" width="auto">
  //   <Box>
  //     <Text as="label" size="5">Limited Time Promotional Coupons</Text>
  //     <Text as="p" size="3">
  //       20% Off:
  //       {' '}
  //       <strong>EVERYTHINGOFF20</strong>
  //     </Text>
  //     <Text as="p" size="3">
  //       40% Off on $30+:
  //       {' '}
  //       <strong>BIGBIG40</strong>
  //     </Text>
  //     <Text as="p" size="3">
  //       $5 Off:
  //       {' '}
  //       <strong>SPECIAL5</strong>
  //     </Text>

  //   </Box>
  //   {/* <Box>
  //     <img
  //       src={VividMacrarons}
  //       alt="Vivid Macarons"
  //       style={{
  //         width: '50%',
  //       }}
  //     />
  //   </Box> */}
  // </Grid>
}

export default CouponEventCard;
