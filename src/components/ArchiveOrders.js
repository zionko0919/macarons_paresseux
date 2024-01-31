/* eslint-disable no-unused-vars */
import { Container, Box, Typography } from '@mui/material';
import { Outlet, Route, Routes } from 'react-router-dom';
import ArchieveOrderTable from './OrdersArchiveTable';
import NewArchiveTable from './newArchiveOrderTable';

function ArchiveOrderViewer() {
  return (
    <>
      <Box>
        <Typography variant="p">Archive Viewer Prototype:</Typography>
        <Typography variant="h5">Archive Order Viewer</Typography>
      </Box>
      {/* <ArchieveOrderTable /> */}
      <NewArchiveTable />
    </>

  );
}

export default ArchiveOrderViewer;
