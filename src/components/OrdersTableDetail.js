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

function OrdersTableEntryInfo({ order }) {
  const {
    macItems, drinkItems, packItems, optionalItems,
  } = useContext(OrderContext);

  const [orders, setOrders] = useState([]);

  const { currentUser } = useCurrentUserContext();

  const loadOrders = () => {
    axios.get('/api/orders')
      .then((result) => setOrders(result.data))
      .catch(console.error);
  };

  useEffect(
    () => {
      if (currentUser.access === 'admin') {
        loadOrders();
        return () => {
          setOrders([]);
        };
      }
      return () => { };
    },
    [currentUser],
  );

  return (
    <Box>
      <Box>
        <TableContainer component={Paper}>
          {/* {order} */}
          {order.items.map((item) => (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    {(macItems.find((i) => i.itemId === item.itemId)?.title)
                        || (packItems.find((i) => i.itemId === item.itemId)?.title)
                        || (drinkItems.find((i) => i.itemId === item.itemId)?.title)
                        || (optionalItems.find((i) => i.itemId === item.itemId)?.title)}
                  </TableCell>
                  {item.giftOption && (
                    <>
                      <TableCell align="right">Gift-Wrap: </TableCell>
                      <TableCell>{item.giftOption.isGiftOptionSelected ? 'Yes' : 'No'}</TableCell>
                    </>
                  )}
                  <TableCell align="right">Quantity: </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell align="right">Price:</TableCell>
                  <TableCell align="right">
                    $
                    {' '}
                    {(macItems.find((i) => i.itemId === item.itemId)?.price.toFixed(2))
                        || (packItems.find((i) => i.itemId === item.itemId)?.price.toFixed(2))
                        || (drinkItems.find((i) => i.itemId === item.itemId)?.price.toFixed(2))
                        || (optionalItems.find((i) => i.itemId === item.itemId)?.price.toFixed(2))}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Subitems</TableCell>
                  <TableCell>Quantity</TableCell>
                </TableRow>
              </TableHead>
              {item.category === 'pack' && (
                <TableBody>
                  <TableRow>
                    {item.category === 'pack' && (
                      item.subItem.map((mac) => (
                        <TableRow key={mac.itemId}>
                          <TableCell align="right" colSpan={6}>
                            {(macItems.find((i) => i.itemId === mac.itemId)?.title)}
                          </TableCell>
                          <TableCell align="right">{mac.quantity}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableRow>
                </TableBody>
              )}
            </Table>
          ))}
        </TableContainer>
      </Box>
      <Box marginTop={2}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Billing ZIPcode</TableCell>
                <TableCell align="right">Subtotal</TableCell>
                <TableCell align="right">
                  Discounts
                  (
                  {order.couponDiscountPercentage.toFixed(1)}
                  %)
                </TableCell>
                <TableCell align="right">
                  Sales Tax
                  (
                  {(order.taxRate * 100).toFixed(3)}
                  %)

                </TableCell>
                <TableCell align="right">Total</TableCell>
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
