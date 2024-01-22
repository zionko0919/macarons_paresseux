/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import Slider from 'react-slick';
import { Grid } from '@mui/material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './HomeCarousel.css';
import macaronsA from '../images/macaron_random_images/macarons_A.png';
import macaronsB from '../images/macaron_random_images/macarons_B.png';
import macaronsC from '../images/macaron_random_images/macarons_C.png';
import MacaronDefinition from './MacaronDefinition';
import WeAreNotRealCard from './EventComponents/WeAreNotRealCard';
import CouponEventCard from './EventComponents/CouponEventCard';

function HomeCarousel() {
  return (
    <Slider
      dots
      infinite
      fade
      speed={1000}
      autoplay
      autoplaySpeed={5000}
      slidesToScroll={1}
      slidesToShow={1}
      cssEase="linear"
      pauseOnHover
      arrows
      swipeToSlide
    >
      <div>
        <img src={macaronsA} alt="macaronsA" height="500" />
      </div>
      <div>
        <img src={macaronsB} alt="macaronsB" height="500" />
      </div>
      <div>
        <img src={macaronsC} alt="macaronsC" height="500" />
      </div>
      <MacaronDefinition />
      <WeAreNotRealCard />
      <CouponEventCard />
    </Slider>
  );
}

export default HomeCarousel;
