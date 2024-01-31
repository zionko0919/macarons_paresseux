/* eslint-disable react-hooks/exhaustive-deps */
// Changing this component to be Dashboard.
/* eslint-disable no-unused-vars */
import axios from 'axios';
import {
  useEffect, useState, useContext, useMemo, useCallback,
} from 'react';
import {
  Container, Box, Typography, Paper, Button,
} from '@mui/material';
import { Link, Route, Routes } from 'react-router-dom';
import OrderContext from '../context/OrderContext';
import DashboardContext from '../context/DashboardContext';
import { useCurrentUserContext } from '../context/CurrentUserContext';
// import CurrentOrderTable from './OrdersCurrentTable';
// import CurrentQueue from './CurrentQueue';
// import './Orders.css';

function Dashboard() {
  const { currentUser } = useCurrentUserContext();
  const {
    macItems, drinkItems, packItems, optionalItems,
  } = useContext(OrderContext);

  // Start of current order related things --------------------------
  const [currentOrders, setCurrentOrders] = useState([]);

  // const loadOrders = () => {
  //   axios.get('../api/orders')
  //     .then((result) => setCurrentOrders(result.data))
  //     .catch(console.error);
  // };

  useEffect(
    () => {
      if (currentUser.access === 'admin') {
        // loadOrders();
        const ws = new WebSocket(`${(
          window.location.protocol === 'https:' ? 'wss://' : 'ws://'
        )}${window.location.host}/ws-cafe`);
        ws.onopen = () => {
          console.log('connected');
        };
        ws.onerror = (e) => {
          console.error(e);
        };
        ws.onmessage = (message) => {
          const newOrders = JSON.parse(message.data);
          setCurrentOrders(newOrders);
        };
        ws.onclose = () => {
          console.log('disconnected');
        };
        return () => {
          setCurrentOrders([]);
        };
      }
      return () => { };
    },
    [currentUser],
  );

  const deleteOrder = async (order) => {
    try {
      await axios.delete(`api/orders/${order.id}`);
      // loadOrders();
    } catch (error) {
      console.error(error);
    }
  };
  // End of current order related things --------------------------

  // Start of archived order related things -----------------------
  const [archiveOrders, setArchiveOrders] = useState({});

  const [isReadiedOrderSubmitting, setIsReadiedOrderSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const submitReadiedOrder = useCallback(async (event, order) => {
    event.preventDefault();
    setIsReadiedOrderSubmitting(true);
    setApiError('');
    try {
      await axios.post('/api/archiveOrders', {
        order,
      });
    } catch (error) {
      console.log('Error submitting achieved order', error);
      setApiError(error?.response?.data?.error || 'Unknown Error');
    } finally {
      setIsReadiedOrderSubmitting(false);
    }
  }, [setIsReadiedOrderSubmitting, setApiError, archiveOrders]);

  // End of archived order related things --------------------------

  const DashboardContextValues = useMemo(
    () => ({
      archiveOrders,
      setArchiveOrders,
      submitReadiedOrder,
    }),
    [
      archiveOrders,
      setArchiveOrders,
      submitReadiedOrder,
    ],
  );

  return (
    <DashboardContext.Provider value={DashboardContextValues}>
      <Container maxWidth="xl">
        <Box variant="outlined">
          <Typography variant="h5">Dashboard #ToDo</Typography>
          <Box>
            <Link to="/orders">Dashboard Home</Link>
          </Box>
          <Box>
            <Link to="/orders/current_orders">Current Order Queue</Link>
          </Box>
          <Box>
            <Link to="/orders/archive_orders">Archive Orders</Link>
          </Box>
        </Box>
        <Routes>
          {/* <Route path="/current_orders" element={<CurrentQueue />} /> */}
          {/* <CurrentQueue /> */}
        </Routes>
      </Container>
    </DashboardContext.Provider>
  );
}

export default Dashboard;
