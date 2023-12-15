/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { Box, Grid, Text } from '@radix-ui/themes';
import VividMacrarons from './ImagesForEventComponents/vivid_macraons.jpg';

function CouponEventCard() {
  return (
    <Grid columns="2" gap="1" width="auto">
      <Box>
        <Text as="p" size="5">Use this Coupon</Text>
        <Text as="p" size="3">EVERYTHINGOFF20</Text>
      </Box>
      <Box>
        <img
          src={VividMacrarons}
          alt="Vivid Macarons"
          style={{
            width: '50%',
          }}
        />
      </Box>
    </Grid>
  );
}

export default CouponEventCard;
