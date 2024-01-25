/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';

function Clock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update the current time every second
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array to run effect only once on mount

  // Format the date and time
  const formattedDateTime = currentTime.toLocaleString('en-US', {
    timeZone: 'America/Chicago',
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = currentTime.toLocaleString('en-US', {
    timeZone: 'America/Chicago',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  });

  return (
    <Container>
      <Typography>{formattedDateTime}</Typography>
      <Typography>{formattedTime}</Typography>
    </Container>
  );
}

export default Clock;
