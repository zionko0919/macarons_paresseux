import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

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
    timeLeft.days = days > 0 ? `${days} ${days === 1 ? 'day' : 'days'}` : '';

    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    timeLeft.hours = (`0${hours}`).slice(-2);

    const minutes = Math.floor((difference / 1000 / 60) % 60);
    timeLeft.minutes = (`0${minutes}`).slice(-2);

    const seconds = Math.floor((difference / 1000) % 60);
    timeLeft.seconds = (`0${seconds}`).slice(-2);

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

  return (
    <div>
      {!isCountdownOver && (
      <p>
        -
        {' '}
        {`${days} ${hours} : ${minutes} : ${seconds}`}
        {' '}
        left
      </p>
      )}
      {isCountdownOver && (
      <p>
        +
        {' '}
        {`${days} ${hours} : ${minutes} : ${seconds}`}
        {' '}
        passed
      </p>
      )}
    </div>
  );
}

CountdownTimer.propTypes = {
  targetDateTime: PropTypes.string.isRequired,
};

export default CountdownTimer;
