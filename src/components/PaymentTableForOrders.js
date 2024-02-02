/* eslint-disable react/prop-types */
import {
  TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper,
} from '@mui/material';

function PaymentTableForOrders({ order }) {
  return (
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
  );
}

export default PaymentTableForOrders;
