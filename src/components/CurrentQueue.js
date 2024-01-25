/* eslint-disable no-unused-vars */
import { Container, Box, Typography } from '@mui/material';
import { Outlet, Route, Routes } from 'react-router-dom';
import CurrentOrderTable from './OrdersCurrentTable';

function CurrentQueue() {
  return (
    <>
      <Box>
        <Typography variant="p">Current Order Queue Prototype:</Typography>
        <Typography variant="h5">Current Order Queue</Typography>
      </Box>
      <CurrentOrderTable />
    </>

  );
}

export default CurrentQueue;
