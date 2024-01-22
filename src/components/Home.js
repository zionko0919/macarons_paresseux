/* eslint-disable no-unused-vars */
// import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { Grid, Box, Container } from '@mui/material';
import HomeCarousel from './HomeCarousel';
import WeAreNotRealCard from './EventComponents/WeAreNotRealCard';
import CouponEventCard from './EventComponents/CouponEventCard';
import MacaronDefinition from './MacaronDefinition';

function Home() {
  return (
    <Grid>
      <Container>
        <HomeCarousel />
      </Container>
      {/* <MacaronDefinition />
      <CouponEventCard />
      <WeAreNotRealCard /> */}
    </Grid>
  );
}

export default Home;
