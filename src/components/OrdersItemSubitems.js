/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import axios from 'axios';
import PropTypes from 'prop-types';
import {
  useEffect, useState, useContext, useMemo, Fragment,
} from 'react';
import {
  Container, Box,
  Paper, Table, TableCell, TableContainer, TableHead, TableRow, TableBody,
} from '@mui/material';
import OrderContext from '../context/OrderContext';
import { useCurrentUserContext } from '../context/CurrentUserContext';

function SubitemTable({ subitem }) {
  const {
    macItems, drinkItems, packItems, optionalItems,
  } = useContext(OrderContext);

  return (
    <TableContainer component={Paper} variant="none">
      <Table size="small" sx={{ '& td': { border: 0 } }}>
        {/* <TableHead>
          <TableRow>
            <TableCell align="right">Macarons:</TableCell>
            <TableCell aligh="right">Qty:</TableCell>
          </TableRow>
        </TableHead> */}
        <TableBody>
          {subitem.map((mac) => (
            <TableRow key={mac.itemId} component={Paper} variant="none">
              <TableCell width="70%" align="right">
                {(macItems.find((i) => i.itemId === mac.itemId)?.title)}
              </TableCell>
              <TableCell align="right" width="20%">
                {mac.quantity}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default SubitemTable;
