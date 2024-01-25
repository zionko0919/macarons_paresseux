/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import {
  Alert, Container, Typography, Box,
} from '@mui/material';
import {
  SentimentSatisfiedAlt, SentimentVeryDissatisfied,
  SentimentNeutral,
  ConstructionOutlined,
} from '@mui/icons-material';

function CountdownTimer({ targetDateTime }) {
  const calculateTimeLeft = () => {
    let difference = new Date(targetDateTime) - new Date();
    const timeLeft = {};

    if (difference > 0) {
      timeLeft.isCountdownOver = false;
    } else {
      timeLeft.isCountdownOver = true;
      difference *= -1;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    // timeLeft.days = days > 0 ? `${days} ${days === 1 ? 'd' : 'd'}` : '';
    timeLeft.days = days;

    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    // timeLeft.hours = (`0${hours}`).slice(-2);
    timeLeft.hours = hours;

    const minutes = Math.floor((difference / 1000 / 60) % 60);
    // timeLeft.minutes = (`0${minutes}`).slice(-2);
    timeLeft.minutes = minutes;

    const seconds = Math.floor((difference / 1000) % 60);
    // timeLeft.seconds = (`0${seconds}`).slice(-2);
    timeLeft.seconds = seconds;
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const {
    isCountdownOver, days, hours, minutes, seconds,
  } = timeLeft;

  // setReadyOnTime(!isCountdownOver);
  // console.log(isCountdownOver);
  // console.log(!isCountdownOver);
  // console.log(readyOnTime);
  // console.log(isCountdownOver);
  return (
    <Box>
      {!isCountdownOver && (
      <Alert
        severity={days === 0 && hours === 0 && minutes <= 25 ? 'warning' : 'success'}
        icon={days === 0 && hours === 0 && minutes <= 25
          ? <SentimentNeutral fontSize="large" sx={{ color: '#e65100' }} />
          : <SentimentSatisfiedAlt fontSize="large" sx={{ color: '#2e7d32' }} />}
        sx={days === 0 && hours === 0 && minutes <= 25
          ? { justifyContent: 'center', bgcolor: '#ffeb3b' }
          : { justifyContent: 'center', bgcolor: '#69f0ae' }}
      >
        <Typography fontSize="large">
          -
          {' '}
          {`${days}d ${(`0${hours}`).slice(-2)}h ${(`0${minutes}`).slice(-2)}m`}
        </Typography>
      </Alert>
      )}
      {isCountdownOver && (
      <Alert
        severity="error"
        icon={<SentimentVeryDissatisfied fontSize="large" sx={{ color: '#c62828' }} />}
        sx={{ justifyContent: 'center', bgcolor: '#ff8a80' }}
      >
        <Typography fontSize="large">
          +
          {' '}
          {`${days}d ${(`0${hours}`).slice(-2)}h ${(`0${minutes}`).slice(-2)}m`}
        </Typography>
      </Alert>
      )}
    </Box>
  );
}

CountdownTimer.propTypes = {
  targetDateTime: PropTypes.string.isRequired,
};

export default CountdownTimer;
