/* eslint-disable no-unused-vars */
// import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import {
  Flex, Text, Box, Grid, Button, Strong, Code,
} from '@radix-ui/themes';
import WeAreNotRealCard from './EventComponents/WeAreNotRealCard';
import CouponEventCard from './EventComponents/CouponEventCard';

function Home() {
  return (

    <Grid columns="1" gap="3" width="auto" justify="cetner" align="center">
      <Flex direction="column" gap="3">
        <Text size="6">
          <Strong>Welcome to Macarons Paresseux</Strong>
        </Text>
        <Link to="/all_menu">
          <Button type="button" variant="soft">All Menu</Button>
        </Link>
        <Link to="/ordernow">
          <Button type="button">Order Now</Button>
        </Link>
      </Flex>
      <CouponEventCard />
      <WeAreNotRealCard />
    </Grid>
  );
}

export default Home;
