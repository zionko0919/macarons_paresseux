/* eslint-disable no-unused-vars */
import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import {
  Container, Box, Typography, Paper,
} from '@mui/material';
import OrderContext from '../context/OrderContext';
import { useCurrentUserContext } from '../context/CurrentUserContext';
import CurrentOrderTable from '../components/OrdersCurrentTable';
import OrdersTestTable from '../components/OrdersTestTable';
// import './Orders.css';

const tableStyle = {
  borderCollapse: 'collapse',
  marginTop: '10px', // Adjust the margin as needed
};

const itemStyle = {
  borderTop: '1px solid #ddd', // Add a border between each item
  // borderBottom: '1px solid #ddd',
  padding: '8px',
};

function Orders() {
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

  const deleteOrder = async (order) => {
    try {
      await axios.delete(`api/orders/${order.id}`);
      loadOrders();
    } catch (error) {
      console.error(error);
    }
  };
  // console.log(currentUser);
  console.log(orders);

  return (
    <Container maxWidth="xl">
      <Box>
        <Typography variant="h5">Order Queue</Typography>
      </Box>
      <CurrentOrderTable />
    </Container>
  );

  // return (
  //   <div className="orders-component">
  //     <h2>Dashboard</h2>
  //     {orders.length === 0
  //       ? (
  //         <div>
  //           {currentUser.access === 'admin'
  //             ? 'No Orders'
  //             : 'Access Denied'}
  //         </div>
  //       )
  //       : orders.map((order) => (
  //         <div className="order" key={order.id}>
  //           <table style={tableStyle}>
  //             <thead>
  //               <tr>
  //                 <th>Invoice Number: </th>
  //                 <td>{order.invoiceNum}</td>
  //               </tr>
  //             </thead>
  //             <thead>
  //               <tr>
  //                 <th>Order Date:</th>
  //                 <td>{order.orderTimeLog}</td>
  //               </tr>
  //             </thead>
  //             <thead>
  //               <tr>
  //                 <th>
  //                   Pick Up Date/Time:
  //                 </th>
  //                 {order.pickUpDateString}
  //                 {' '}
  //                 {order.pickUpTime}
  //               </tr>
  //             </thead>
  //             <thead>
  //               <tr>
  //                 <th>Customer</th>
  //                 <th>ZIP Code</th>
  //                 {order.phone && <th>Phone</th>}
  //               </tr>
  //             </thead>
  //             <tbody>
  //               <tr>
  //                 <td>{order.name}</td>
  //                 <td>{order.zipCode}</td>
  //                 {order.phone && <td>{order.phone}</td>}
  //               </tr>
  //             </tbody>
  //             <tbody>
  //               <tr>
  //                 <th>Subtotal</th>
  //                 <th>Discounts</th>
  //                 <th>Sales Tax</th>
  //                 <th>Total</th>
  //               </tr>
  //             </tbody>
  //             <tbody>
  //               <tr>
  //                 <td>
  //                   $
  //                   {order.subTotal.toFixed(2)}
  //                 </td>
  //                 <td>
  //                   - $
  //                   {order.couponDiscountPrice.toFixed(2)}
  //                   {' '}
  //                   (
  //                   {order.couponDiscountPercentage.toFixed(1)}
  //                   %)
  //                 </td>
  //                 <td>
  //                   + $
  //                   {order.taxAmount.toFixed(2)}
  //                   {' '}
  //                   (
  //                   {(order.taxRate * 100).toFixed(3)}
  //                   %)
  //                 </td>
  //                 <td>
  //                   <b>
  //                     $
  //                     {order.total.toFixed(2)}
  //                   </b>
  //                 </td>
  //               </tr>
  //             </tbody>
  //             {order.items.map((item) => (
  //               <tbody key={item.key}>
  //                 <tr style={itemStyle}>
  //                   <td>{item.quantity}</td>
  //                   <td>
  //                     {(macItems.find((i) => i.itemId === item.itemId)?.title)
  //                       || (packItems.find((i) => i.itemId === item.itemId)?.title)
  //                       || (drinkItems.find((i) => i.itemId === item.itemId)?.title)
  //                       || (optionalItems.find((i) => i.itemId === item.itemId)?.title)}
  //                   </td>
  //                 </tr>
  //                 {item.category === 'pack' && (
  //                   <tr>
  //                     <td colSpan="3">
  //                       <b>Subitems:</b>
  //                     </td>
  //                   </tr>
  //                 )}
  //                 {item.category === 'pack' && (
  //                   item.subItem.map((mac) => (
  //                     <tr key={mac.itemId}>
  //                       <td>{(macItems.find((i) => i.itemId === mac.itemId)?.title)}</td>
  //                       <td colSpan="2">{mac.quantity}</td>
  //                     </tr>
  //                   ))
  //                 )}
  //                 {item.giftOption && (
  //                   <tr>
  //                     <td>
  //                       <b>Gift-Wrap</b>
  //                     </td>
  //                     <td>
  //                       {item.giftOption.isGiftOptionSelected ? 'Yes' : 'No'}
  //                     </td>
  //                   </tr>
  //                 )}
  //                 {item.giftOption && item.giftOption.isGiftOptionSelected && (
  //                   <tr>
  //                     <td>
  //                       <b>Message: </b>
  //                     </td>
  //                     <td>
  //                       {item.giftOption.giftMessage}
  //                     </td>
  //                   </tr>
  //                 )}
  //                 {item.giftOption && item.giftOption.isGiftOptionSelected && (
  //                   <tr>
  //                     <td>
  //                       <b>From: </b>
  //                     </td>
  //                     <td>
  //                       {item.giftOption.giftSenderName}
  //                     </td>
  //                   </tr>
  //                 )}
  //               </tbody>
  //             ))}
  //           </table>
  //           <button
  //             type="button"
  //             onClick={() => deleteOrder(order)}
  //           >
  //             Delete Order
  //           </button>
  //         </div>
  //       ))}
  //   </div>
  // );
}

export default Orders;
