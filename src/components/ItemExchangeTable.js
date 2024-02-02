/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { useState, useContext } from 'react';
import {
  Box, Table, TableBody, TableHead, TableCell, Container, Typography, TableContainer, TableRow,
} from '@mui/material';
import OrderContext from '../context/OrderContext';

function ItemExchangeTableRow({ item }) {
  const { drinkItems, packItems } = useContext(OrderContext);
  let itemTitle = '';
  if (item.category === 'pack') {
    itemTitle = packItems.find((i) => i.itemId === item.itemId).title;
  } else if (item.category === 'drink') {
    itemTitle = drinkItems.find((i) => i.itemId === item.itemId).title;
  } else {
    itemTitle = 'Error: Can\'t find itemTitle';
  }

  let itemRefundAmount = 0;
  if (item.orderStatus === 'REFUNDED') {
    let itemPrice = 0;
    if (item.category === 'pack') {
      itemPrice = packItems.find((i) => i.itemId === item.itemId).price;
    } else if (item.category === 'drink') {
      itemPrice = drinkItems.find((i) => i.itemId === item.itemId).price;
    }
    itemRefundAmount = itemPrice * item.quantity;
  }

  const formattedExchangeDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
    timeZone: 'America/Chicago', // Central Time (US)
  }).format(new Date());

  return (
    <TableRow>
      <TableCell>
        {itemTitle}
      </TableCell>
      <TableCell>
        #ToDo
        {/* {item.exchangeTotalNum + item.refundTotalNum} */}
      </TableCell>
      <TableCell>
        #Todo
        {/* {formattedExchangeDate} */}
      </TableCell>
      <TableCell>
        #Todo
      </TableCell>
      <TableCell>
        $
        {' '}
        {/* {itemRefundAmount.toFixed(2)} */}
      </TableCell>
    </TableRow>
  );
}

function ItemExchangeTable({ order }) {
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell colSpan={5}>
              Return/Exchange Center
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography variant="p">Item</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="p">Refund</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="p">Quantity</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="p">Exchange Date</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="p">Exchange Type</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="p">Refund Amount</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {order.items.map((item) => (
            <ItemExchangeTableRow item={item} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ItemExchangeTable;
