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
                <TableCell align="center" width="40%">Item</TableCell>
                <TableCell align="center" width="15%">Quantity</TableCell>
                <TableCell align="center" width="15%">Price (ea.)</TableCell>
                <TableCell align="center" width="15%">Gift-wrap</TableCell>
                <TableCell align="center" width="15%">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {drinkOrderItems.map((item) => (
                <Fragment key={item.itemId}>
                  <TableRow>
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
                  </TableRow>
                  {item.category === 'pack' && (
                    <TableRow>
                      <TableCell align="right" colSpan={5}>
                        <SubitemTable subitem={item.subItem} />
                        {item.giftOption && item.giftOption.isGiftOptionSelected && (
                          <TableContainer component={Paper} variant="none">
                            <Table size="small">
                              <TableBody>
                                <TableRow>
                                  <TableCell>Gift Sender: </TableCell>
                                  <TableCell>{item.giftOption.giftSenderName}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>Message:</TableCell>
                                  <TableCell>{item.giftOption.giftMessage}</TableCell>
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
              {packOrderItems.map((item) => (
                <Fragment key={item.itemId}>
                  <TableRow>
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
                  </TableRow>
                  {item.category === 'pack' && (
                    <TableRow>
                      <TableCell align="right" colSpan={5}>
                        <SubitemTable subitem={item.subItem} />
                        {item.giftOption && item.giftOption.isGiftOptionSelected && (
                          <TableContainer component={Paper} variant="none">
                            <Table size="small">
                              <TableBody>
                                <TableRow>
                                  <TableCell>Gift Sender: </TableCell>
                                  <TableCell>{item.giftOption.giftSenderName}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>Message:</TableCell>
                                  <TableCell>{item.giftOption.giftMessage}</TableCell>
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
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center">Billing ZIPcode</TableCell>
                <TableCell align="right">Subtotal</TableCell>
                <TableCell align="right">
                  Discounts (
                  {order.couponDiscountPercentage.toFixed(1)}
                  %)
                </TableCell>
                <TableCell align="right">
                  Sales Tax (
                  {(order.taxRate * 100).toFixed(3)}
                  %)
                </TableCell>
                <TableCell align="right">Final Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align="center">{order.zipCode}</TableCell>
                <TableCell align="right">
                  $
                  {' '}
                  {order.subTotal.toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  - $
                  {' '}
                  {order.couponDiscountPrice.toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  + $
                  {' '}
                  {order.taxAmount.toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  $
                  {' '}
                  {order.total.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default OrdersTableEntryInfo;
