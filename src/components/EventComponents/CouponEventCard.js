/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { Box, Grid, Text } from '@radix-ui/themes';
import VividMacrarons from './ImagesForEventComponents/vivid_macraons.jpg';

function CouponEventCard() {
  return (
    <Grid columns="2" gap="1" width="auto">
      <Box>
        <Text as="label" size="5">Promotional Coupons</Text>
        <Text as="p" size="3">
          20% Off:
          {' '}
          <strong>EVERYTHINGOFF20</strong>
        </Text>
        <Text as="p" size="3">
          40% Off on $30+:
          {' '}
          <strong>BIGBIG40</strong>
        </Text>
        <Text as="p" size="3">
          $5 Off:
          {' '}
          <strong>SPECIAL5</strong>
        </Text>

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
