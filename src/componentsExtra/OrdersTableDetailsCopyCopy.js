/* eslint-disable max-len */
/* eslint-disable no-unsafe-optional-chaining */
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
import SubitemTable from '../components/OrdersItemSubitems';

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
            {order.items.map((item) => (
              <>
                <TableBody>
                  <TableRow sx={{ '& td': { border: 0 } }}>
                    <TableCell align="center">
                      {(macItems.find((i) => i.itemId === item.itemId)?.title)
                        || (packItems.find((i) => i.itemId === item.itemId)?.title)
                        || (drinkItems.find((i) => i.itemId === item.itemId)?.title)
                        || (optionalItems.find((i) => i.itemId === item.itemId)?.title)}
                    </TableCell>
                    <TableCell align="center">{item.quantity}</TableCell>
                    <TableCell align="center">
                      $
                      {' '}
                      {(macItems.find((i) => i.itemId === item.itemId)?.price.toFixed(2))
                        || (packItems.find((i) => i.itemId === item.itemId)?.price.toFixed(2))
                        || (drinkItems.find((i) => i.itemId === item.itemId)?.price.toFixed(2))
                        || (optionalItems.find((i) => i.itemId === item.itemId)?.price.toFixed(2))}
                    </TableCell>
                    {item.giftOption && (
                    <TableCell align="center">{item.giftOption.isGiftOptionSelected ? '+ $ 2.00' : 'X'}</TableCell>
                    )}
                    <TableCell align="center">
                      $
                      {' '}
                      {((macItems.find((i) => i.itemId === item.itemId)?.price.toFixed(2))
                      || (packItems.find((i) => i.itemId === item.itemId)?.price.toFixed(2))
                      || (drinkItems.find((i) => i.itemId === item.itemId)?.price.toFixed(2))
                      || (optionalItems.find((i) => i.itemId === item.itemId)?.price.toFixed(2)))}
                    </TableCell>
                  </TableRow>
                </TableBody>
                {item.category === 'pack' && (
                <TableBody>
                  <TableRow sx={{ '& td': { border: 0 } }}>
                    <TableCell align="right" sx={{ verticalAlign: 'top' }}>
                      {item.category === 'pack' && <SubitemTable subitem={item.subItem} />}
                    </TableCell>
                    {item.giftOption && item.giftOption.isGiftOptionSelected && (
                    <TableCell colSpan={4}>
                      <TableContainer component={Paper} variant="none">
                        <Table size="small">
                          <TableBody>
                            <TableRow>
                              <TableCell sx={{ verticalAlign: 'top' }} width="20%">Gift Sender: </TableCell>
                              <TableCell>{item.giftOption.giftSenderName}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ verticalAlign: 'top' }}>Message:</TableCell>
                              <TableCell>{item.giftOption.giftMessage}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </TableCell>
                    )}
                  </TableRow>
                </TableBody>
                )}
              </>
            ))}
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
