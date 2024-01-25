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
import CurrentOrderTable from './OrdersCurrentTable';
import CurrentQueue from './CurrentQueue';
// import './Orders.css';

function Dashboard() {
  const { currentUser } = useCurrentUserContext();
  const {
    macItems, drinkItems, packItems, optionalItems,
  } = useContext(OrderContext);

  // Start of current order related things --------------------------
  const [currentOrders, setCurrentOrders] = useState([]);

  const loadOrders = () => {
    axios.get('../api/orders')
      .then((result) => setCurrentOrders(result.data))
      .catch(console.error);
  };

  useEffect(
    () => {
      if (currentUser.access === 'admin') {
        loadOrders();
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
      loadOrders();
    } catch (error) {
      console.error(error);
    }
  };
  // End of current order related things --------------------------

  // Start of archieved order related things -----------------------
  const [archievedOrders, setArchievedOrders] = useState({});

  const [isReadiedOrderSubmitting, setIsReadiedOrderSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const submitReadiedOrder = useCallback(async (event, order) => {
    event.preventDefault();
    setIsReadiedOrderSubmitting(true);
    setApiError('');
    try {
      await axios.post('/api/archievedOrders', {
        order,
      });
    } catch (error) {
      console.log('Error submitting achieved order', error);
      setApiError(error?.response?.data?.error || 'Unknown Error');
    } finally {
      setIsReadiedOrderSubmitting(false);
    }
  }, [setIsReadiedOrderSubmitting, setApiError, archievedOrders]);

  // End of archieved order related things --------------------------

  const DashboardContextValues = useMemo(
    () => ({
      archievedOrders,
      setArchievedOrders,
      submitReadiedOrder,
    }),
    [
      archievedOrders,
      setArchievedOrders,
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
            <Link to="/orders/archieve_orders">Archieved Orders</Link>
          </Box>
        </Box>
        <Routes>
          <Route path="/current_orders" element={<CurrentQueue />} />
          {/* <CurrentQueue /> */}
        </Routes>
      </Container>
    </DashboardContext.Provider>
  );
}

export default Dashboard;
