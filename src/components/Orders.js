/* eslint-disable react-hooks/exhaustive-deps */
// Changing this component to be Dashboard.
/* eslint-disable no-unused-vars */
import axios from 'axios';
import {
  useEffect, useState, useContext, useMemo, useCallback,
} from 'react';
import {
  Container, Box, Typography, Paper, Button, Alert,
} from '@mui/material';
import { Link, Route, Routes } from 'react-router-dom';
import OrderContext from '../context/OrderContext';
import DashboardContext from '../context/DashboardContext';
import { useCurrentUserContext } from '../context/CurrentUserContext';
import CurrentQueue from './CurrentQueue';
import ArchiveOrderViewer from './ArchiveOrders';
import ProductManagement from './ProductManagement';
import ServiceManagement from './ServiceManagement';
import OperationManagement from './OperationManagement';
// import './Orders.css';

function Dashboard() {
  const { currentUser } = useCurrentUserContext();
  const {
    macItems, drinkItems, packItems, optionalItems,
  } = useContext(OrderContext);

  // Start of current order related things --------------------------
  const [activeOrders, setActiveOrders] = useState([]);
  const [archiveOrders, setArchiveOrders] = useState([]);

  // const loadOrders = () => {
  //   axios.get('../api/orders')
  //     .then((result) => setCurrentOrders(result.data))
  //     .catch(console.error);
  // };

  useEffect(
    () => {
      if (currentUser.access === 'admin') {
        const ws = new WebSocket(`${(
          window.location.protocol === 'https:' ? 'wss://' : 'ws://'
        )}${window.location.host}/ws-cafe/`);

        ws.onopen = () => {
          console.log('WebSocket Connected');
          // ws.send(JSON.stringify({ type: connectionType }));
        };
        ws.onerror = (e) => {
          console.error('WebSocket Error:', e);
        };
        ws.onmessage = (message) => {
          const parsedMessage = JSON.parse(message.data);
          if (parsedMessage.type === 'currentOrders') {
            const newOrders = parsedMessage.data;
            setActiveOrders(newOrders);
          } else if (parsedMessage.type === 'archiveOrders') {
            const oldOrders = parsedMessage.data;
            setArchiveOrders(oldOrders);
          }
          // console.log('NEW: ', activeOrders);
          // console.log('OLD: ', archiveOrders);
        };
        ws.onclose = () => {
          console.log('WebSocket Disconnected');
        };
        return () => {
          ws.close();
          setActiveOrders([]);
          setArchiveOrders([]);
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

  const [isReadiedOrderSubmitting, setIsReadiedOrderSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const submitReadiedOrder = useCallback(async (e, order) => {
    e.preventDefault();
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
      activeOrders,
      setActiveOrders,
    }),
    [
      archiveOrders,
      setArchiveOrders,
      submitReadiedOrder,
      activeOrders,
      setActiveOrders,
    ],
  );

  return (
    <DashboardContext.Provider value={DashboardContextValues}>
      {currentUser.access !== 'admin'
        ? (
          <Container maxWidth="xl">
            <Box marginTop={3}>
              <Alert color="error" variant="filled">
                Access Denied
              </Alert>
            </Box>
          </Container>
        ) : (
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
              <Box>
                <Link to="/orders/operation_management">Operation Management</Link>
              </Box>
              <Box>
                <Link to="/orders/product_management">Product Management</Link>
              </Box>
              <Box>
                <Link to="/orders/service_management">Service Management</Link>
              </Box>
            </Box>
            <Routes>
              <Route path="/archive_orders" element={<ArchiveOrderViewer />} />
            </Routes>
            <Routes>
              <Route path="/current_orders" element={<CurrentQueue />} />
            </Routes>
            <Routes>
              <Route path="/product_management" element={<ProductManagement />} />
            </Routes>
            <Routes>
              <Route path="/service_management" element={<ServiceManagement />} />
            </Routes>
            <Routes>
              <Route path="/operation_management" element={<OperationManagement />} />
            </Routes>
          </Container>
        )}

    </DashboardContext.Provider>
  );
}

export default Dashboard;
