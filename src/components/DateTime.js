/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import React, {
  useContext, useState, useMemo, useEffect,
} from 'react';
import {
  Select, MenuItem, Divider, InputLabel, FormControl, Box, Container,
} from '@mui/material';
import OrderContext from '../context/OrderContext';
import Alert from './Alert';

function DateTime({ showTimeSelectionError, setShowTimeSelectionError }) {
  const {
    pickUpDate,
    setPickUpDate,
    pickUpTime,
    setPickUpTime,
    pickUpDateString,
    setPickUpDateString,
    pickUpDateTime,
    setPickUpDateTime,
  } = useContext(OrderContext);

  const currentDateTime = useMemo(() => new Date(), []); // Initialize currentDateTime using useMemo

  const dateStamps = Array.from({ length: 7 }, (_, i) => {
    const today = new Date();
    today.setDate(today.getDate() + i);
    return { id: `date${i}`, date: today };
  });

  const startTime = new Date();
  startTime.setHours(10, 0, 0, 0); // Set the start time to 10:00 AM

  const endTime = new Date();
  endTime.setHours(20, 30, 0, 0); // Set the end time to 8:30 PM

  const interval = 30; // 30 minutes

  const timeStamps = [];

  for (let timestamp = startTime.getTime();
    timestamp <= endTime.getTime();
    timestamp += interval * 60 * 1000) {
    const currentTimestamp = new Date(timestamp);
    const isPastTime = pickUpDate === 'date0' && currentTimestamp < currentDateTime;
    const isCloseToCurrentTime = pickUpDate === 'date0' && currentTimestamp <= new Date(currentDateTime.getTime() + 25 * 60 * 1000);
    const isDisabled = isPastTime || isCloseToCurrentTime;
    const time = currentTimestamp.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });

    timeStamps.push(
      <MenuItem key={time} value={time} disabled={isDisabled}>
        {time}
      </MenuItem>,
    );
    if (time === '11:30 AM') {
      timeStamps.push(<Divider key={`${time}-divider`} />);
    }
  }

  // Add 'ASAP' as the first option in your timeStamps array only if the selected date is today
  if (pickUpDate === 'date0') {
    timeStamps.unshift(
      <MenuItem key="ASAP" value="ASAP">
        ASAP
      </MenuItem>,
    );
  }

  const handleDateChange = (event) => {
    const { value } = event.target;
    setPickUpDate(value);
    if (value === 'date0') {
      // If the selected date is today
      const selectedDateTime = new Date(`${pickUpDateString} ${pickUpTime}`);
      if (selectedDateTime < currentDateTime) {
        // Display an alert if the selected time is in the past
        setShowTimeSelectionError(true);
      } else {
        // Hide the alert
        setShowTimeSelectionError(false);
      }
    }
  };

  const handleTimeChange = (event) => {
    const { value } = event.target;
    if (value === 'ASAP') {
      // If ASAP is selected, hide the alert and set the selected time
      setShowTimeSelectionError(false);
      setPickUpTime(value);
    } else {
      const selectedDateTime = new Date(`${pickUpDateString} ${value}`);
      if (selectedDateTime < currentDateTime) {
        // Display an alert if the selected time is in the past
        setShowTimeSelectionError(true);
      } else {
        // Hide the alert and set the selected time
        setShowTimeSelectionError(false);
        setPickUpTime(value);
      }
    }
  };

  useEffect(() => {
    const readableDateString = dateStamps.find(
      (i) => i.id === pickUpDate,
    ).date.toLocaleDateString();
    setPickUpDateString(readableDateString);
  }, [pickUpDate, dateStamps, pickUpDateString, setPickUpDateString]);

  useEffect(() => {
    if (pickUpDate === 'date0') {
      // If the selected date is today
      const selectedDateTime = new Date(`${pickUpDateString} ${pickUpTime}`);
      if (selectedDateTime < currentDateTime) {
        // Display an alert if the selected time is in the past
        setShowTimeSelectionError(true);
      } else {
        // Hide the alert
        setShowTimeSelectionError(false);
      }
    }
  }, [pickUpDate, pickUpDateString, pickUpTime, currentDateTime, setShowTimeSelectionError]);

  useEffect(() => {
    if (pickUpTime === 'ASAP') {
      // If pickUpTime is ASAP, set pickUpDateTime to currentDateTime plus 25 minutes
      const newDateTime = new Date(currentDateTime.getTime() + 25 * 60 * 1000);
      const chicagoDateTimeString = newDateTime.toLocaleString('en-US', {
        timeZone: 'America/Chicago',
      });
      setPickUpDateTime((chicagoDateTimeString));
    } else {
      // Otherwise, set pickUpDateTime based on the selected date and time
      const selectedDateTime = new Date(`${pickUpDateString} ${pickUpTime}`);
      const chicagoDateTimeString = selectedDateTime.toLocaleString('en-US', {
        timeZone: 'America/Chicago',
      });
      setPickUpDateTime((chicagoDateTimeString));
    }
  }, [pickUpTime, currentDateTime, pickUpDateString, setPickUpDateTime]);

  return (
    <Container>

      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel>Set Date</InputLabel>
        <Select
          value={pickUpDate}
          onChange={handleDateChange}
          label="Set Date"
        >
          {dateStamps.map(({ id, date }) => (
            <MenuItem key={id} value={id}>
              {date.toLocaleDateString()}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel>Set Time</InputLabel>
        <Select
          value={pickUpTime}
          onChange={handleTimeChange}
          label="Set Time"
        >
          {timeStamps}
        </Select>
      </FormControl>

      {showTimeSelectionError && <Alert severity="error">The selected time is in the past. Please select a future time.</Alert>}
    </Container>
  );
}

DateTime.propTypes = {
  showTimeSelectionError: PropTypes.bool.isRequired,
  setShowTimeSelectionError: PropTypes.func.isRequired,
};

export default DateTime;
