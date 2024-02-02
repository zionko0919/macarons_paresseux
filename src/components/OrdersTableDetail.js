/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import axios from 'axios';
import PropTypes from 'prop-types';
import React, {
  useEffect, useState, useContext, useMemo, Fragment,
} from 'react';
import {
  Box,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  TextField,
} from '@mui/material';
import OrderContext from '../context/OrderContext';
import { useCurrentUserContext } from '../context/CurrentUserContext';
import SubitemTable from './OrdersItemSubitems';
import PaymentTableForOrders from './PaymentTableForOrders';

function OrdersTableEntryInfo({ order }) {
  const {
    macItems, drinkItems, packItems, optionalItems,
  } = useContext(OrderContext);

  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const { currentUser } = useCurrentUserContext();

  const loadOrders = () => {
    axios.get('/api/orders')
      .then((result) => setOrders(result.data))
      .catch(console.error);
  };

  useEffect(() => {
    if (currentUser.access === 'admin') {
      loadOrders();
      return () => {
        setOrders([]);
      };
    }
    return () => { };
  }, [currentUser]);

  const filteredItems = useMemo(() => order.items.filter((item) => (
    item.itemId.toString().includes(searchTerm)
      || item.quantity.toString().includes(searchTerm)
  )), [order.items, searchTerm]);

  const drinkOrderItems = filteredItems.filter(
    (item) => drinkItems.find((i) => i.itemId === item.itemId),
  );
  const packOrderItems = filteredItems.filter(
    (item) => packItems.find((i) => i.itemId === item.itemId),
  );

  return (
    <Box>
      <Box marginTop={2}>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow component={Paper} variant="none">
                <TableCell align="center" width="15%">Date</TableCell>
                <TableCell align="center" width="30%">Item</TableCell>
                <TableCell align="center" width="10%">Quantity</TableCell>
                <TableCell align="center" width="10%">Price (ea.)</TableCell>
                <TableCell align="center" width="10%">Gift-wrap</TableCell>
                <TableCell align="center" width="15%">Total</TableCell>
                <TableCell align="center" width="10%">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {drinkOrderItems.map((item) => (
                <Fragment key={item.itemId}>
                  <TableRow>
                    <TableCell align="center">
                      #Date Todo
                    </TableCell>
                    <TableCell align="center">
                      {drinkItems.find((i) => i.itemId === item.itemId)?.title}
                    </TableCell>
                    <TableCell align="center">{item.quantity}</TableCell>
                    <TableCell align="center">
                      $
                      {drinkItems.find((i) => i.itemId === item.itemId)?.price.toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      {item.giftOption && item.giftOption.isGiftOptionSelected ? 'O' : 'X'}
                    </TableCell>
                    <TableCell align="center">
                      {/* Using optional chaining to safely access item price */}
                      $
                      {((item.quantity || 0) * ((drinkItems.find(
                        (i) => i.itemId === item.itemId,
                      ) || {}).price || 0) + (item.giftOption
                      && item.giftOption.isGiftOptionSelected ? 2 : 0)).toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      #Status ToDo
                    </TableCell>
                  </TableRow>
                </Fragment>
              ))}
              {packOrderItems.map((item) => (
                <Fragment key={item.itemId}>
                  <TableRow>
                    <TableCell align="center">
                      #Date Todo
                    </TableCell>
                    <TableCell align="center">
                      {packItems.find((i) => i.itemId === item.itemId)?.title}
                    </TableCell>
                    <TableCell align="center">{item.quantity}</TableCell>
                    <TableCell align="center">
                      $
                      {packItems.find((i) => i.itemId === item.itemId)?.price.toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      {item.giftOption && item.giftOption.isGiftOptionSelected ? 'O' : 'X'}
                    </TableCell>
                    <TableCell align="center">
                      {/* Using optional chaining to safely access item price */}
                      $
                      {((item.quantity || 0) * ((packItems.find(
                        (i) => i.itemId === item.itemId,
                      ) || {}).price || 0) + (item.giftOption
                      && item.giftOption.isGiftOptionSelected ? 2 : 0)).toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      #Status ToDo
                    </TableCell>
                  </TableRow>
                  {item.category === 'pack' && (
                    <TableRow>
                      <TableCell align="right" colSpan={2}>
                        <SubitemTable subitem={item.subItem} />
                        {item.giftOption && item.giftOption.isGiftOptionSelected && (
                          <TableContainer component={Paper} variant="none">
                            <Table size="small">
                              <TableBody>
                                <TableRow>
                                  <TableCell>Message:</TableCell>
                                  <TableCell>{item.giftOption.giftMessage}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>Gift From: </TableCell>
                                  <TableCell>{item.giftOption.giftSenderName}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableContainer>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box marginTop={2}>
        <PaymentTableForOrders order={order} />
      </Box>
    </Box>
  );
}

export default OrdersTableEntryInfo;
