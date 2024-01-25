/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import React, {
  useContext, useState, useMemo, useEffect,
} from 'react';
import { Select } from '@radix-ui/themes';
import OrderContext from '../context/OrderContext';
import Alert from '../components/Alert';

function DateTime({ showTimeSelectionError, setShowTimeSelectionError }) {
  const {
    pickUpDate,
    setPickUpDate,
    pickUpTime,
    setPickUpTime,
    pickUpDateString,
    setPickUpDateString,
  } = useContext(OrderContext);

  // const [showTimeSelectionError, setShowTimeSelectionError] = useState(false);
  const currentDateTime = useMemo(() => new Date(), []);

  const dateStamps = Array.from({ length: 7 }, (_, i) => {
    const today = new Date();
    today.setDate(today.getDate() + i);
    return { id: `date${i}`, date: today };
  });

  const startTime = new Date();
  startTime.setHours(10, 0, 0, 0);

  const endTime = new Date();
  endTime.setHours(20, 30, 0, 0);

  const interval = 30;

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
      <React.Fragment key={time}>
        <Select.Item value={time} disabled={isDisabled}>
          {time}
        </Select.Item>
        {time === '11:30 AM' && <Select.Separator />}
      </React.Fragment>,
    );
  }

  // console.log(pickUpDate);
  // console.log(pickUpDateString);
  // console.log(pickUpTime);
  const handleDateChange = (value) => {
    setPickUpDate(value);
    if (value === 'date0') {
      const selectedDateTime = new Date(`${pickUpDateString} ${pickUpTime}`);
      // console.log(selectedDateTime);
      if (selectedDateTime < currentDateTime) {
        setShowTimeSelectionError(true);
      } else {
        setShowTimeSelectionError(false);
      }
    }
  };

  const handleTimeChange = (value) => {
    if (value === 'ASAP') {
      setShowTimeSelectionError(false);
      setPickUpTime(value);
    } else {
      const selectedDateTime = new Date(`${pickUpDateString} ${value}`);
      if (selectedDateTime < currentDateTime) {
        setShowTimeSelectionError(true);
      } else {
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
      const selectedDateTime = new Date(`${pickUpDateString} ${pickUpTime}`);
      if (selectedDateTime < currentDateTime) {
        setShowTimeSelectionError(true);
      } else {
        setShowTimeSelectionError(false);
      }
    }
  }, [pickUpDate, pickUpDateString, pickUpTime, currentDateTime, setShowTimeSelectionError]);

  return (
    <div>
      When would you like to pick up your order?
      <div>
        <Select.Root value={pickUpDate} onValueChange={handleDateChange}>
          <Select.Trigger />
          <Select.Content position="popper">
            <Select.Group>
              <Select.Label>SET DATE</Select.Label>
              {dateStamps.map((day) => (
                <Select.Item key={day.id} value={day.id}>
                  {day.date.toLocaleDateString('en-us', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                    timeZone: 'America/Chicago',
                  })}
                </Select.Item>
              ))}
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </div>
      {pickUpDate === 'date0' && (
        <div>
          <Select.Root value={pickUpTime} onValueChange={handleTimeChange}>
            <Select.Trigger placeholder="Set Time" />
            <Select.Content>
              <Select.Group>
                <Select.Label>SET TIME</Select.Label>
                <Select.Item key="asap" value="ASAP">
                  ASAP (25mins)
                </Select.Item>
                {timeStamps}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>
      )}
      {pickUpDate !== 'date0' && (
        <div>
          <Select.Root value={pickUpTime} onValueChange={handleTimeChange}>
            <Select.Trigger placeholder="Set Time" />
            <Select.Content>
              <Select.Group>
                <Select.Label>Set Time</Select.Label>
                {timeStamps}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>
      )}
      {showTimeSelectionError && (
        <div>
          <Alert visible={showTimeSelectionError} type="error">
            Please select a different time. The selected time is in the past.
          </Alert>
        </div>
      )}
    </div>
  );
}

DateTime.propTypes = {
  showTimeSelectionError: PropTypes.bool.isRequired,
  setShowTimeSelectionError: PropTypes.func.isRequired,
};

export default DateTime;
