/* eslint-disable no-unused-vars */
import axios from 'axios';
import {
  useEffect, useState, useContext, useMemo, Fragment, useCallback,
} from 'react';
import {
  Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip,
  Paper, Checkbox, Typography, Collapse, Box, TextField, Container, TablePagination,
  IconButton, ButtonGroup, Grid,
} from '@mui/material';
import {
  DeleteRounded, CheckCircleRounded, SentimentDissatisfied, Info, Check,
  SentimentSatisfiedAlt, ArrowUpward, ArrowDownward, SortRounded, Close, Edit,
} from '@mui/icons-material';
import { SnackbarProvider, enqueueSnackbar, useSnackbar } from 'notistack';
import OrderContext from '../context/OrderContext';
import { useCurrentUserContext } from '../context/CurrentUserContext';
import DashboardContext from '../context/DashboardContext';
import CurrentTime from './OrdersTableTimer';
import CountdownTimer from './OrdersTableCountdown';
import OrdersTableEntryInfo from './OrdersTableDetail';
import CurrentTimeClock from './CurrentTimeClock';

function CurrentOrderTable() {
  const [apiError, setApiError] = useState('');
  const { currentUser } = useCurrentUserContext();
  const {
    setArchiveOrders, submitReadiedOrder, archiveOrders,
  } = useContext(DashboardContext);
  // const { activeOrders, setActiveOrders } = useContext(DashboardContext);
  const [orders, setOrders] = useState([]);
  useEffect(
    () => {
      if (currentUser.access === 'admin') {
        const ws = new WebSocket(`${(
          window.location.protocol === 'https:' ? 'wss://' : 'ws://'
        )}${window.location.host}/ws-cafe/`);
        ws.onopen = () => {
          console.log('WebSocket Connected');
        };
        ws.onerror = (e) => {
          console.error(e);
        };
        ws.onmessage = (message) => {
          console.log('OrdersCurrentTable Component:');
          console.log('Received WebSocket message:', message.data);
          try {
            const parsedMessage = JSON.parse(message.data);
            if (parsedMessage.type === 'currentOrders') {
              const newOrders = parsedMessage.data;
              setOrders(newOrders);
            }
            // const newOrders = JSON.parse(message.data);
            // console.log('Parsed orders: ', newOrders);
            // setOrders(newOrders);
          } catch (error) {
            console.error('Error: ', error);
            enqueueSnackbar('Loading Data: Failed', { variant: 'error' });
            setApiError(error?.response?.data?.error || 'Unknown Error');
            console.log(apiError);
          }
        };
        ws.onclose = () => {
          console.log('WebSocket Disconnected');
        };
        return () => {
          ws.close();
          setOrders([]);
        };
      }
      return () => {};
    },
    [currentUser, apiError],
  );

  const loadUpdatedActiveOrders = (order) => {
    const ws = new WebSocket(`${(
      window.location.protocol === 'https:' ? 'wss://' : 'ws://'
    )}${window.location.host}/ws-cafe/`);

    ws.onopen = () => {
      console.log('WebSocket Connected');
      // Send a message to the WebSocket server indicating that an order was deleted
      ws.send(JSON.stringify({ type: 'orderDeleted', orderId: order.id }));
    };

    ws.onmessage = (message) => {
      console.log('OrdersCurrentTable Component:');
      console.log('Received WebSocket message:', message.data);
      try {
        const parsedMessage = JSON.parse(message.data);
        if (parsedMessage.type === 'currentOrders') {
          const newOrders = parsedMessage.data;
          setOrders(newOrders);
        }
      } catch (error) {
        console.error('Error: ', error);
        enqueueSnackbar('Loading Data: Fail', { variant: 'error' });
        setApiError(error?.response?.data?.error || 'Unknown Error');
        console.log(apiError);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket Disconnected');
      ws.close();
      setOrders([]);
    };
  };

  const deleteOrder = async (e, order) => {
    e.preventDefault();
    try {
      // Delete the order via REST API
      await axios.delete(`../api/orders/${order.id}`);
      loadUpdatedActiveOrders(order);
      enqueueSnackbar('Delete: Success', { variant: 'success' });
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Delete: Fail', { variant: 'error' });
      setApiError(error?.response?.data?.error || 'Unknown Error');
      console.log(apiError);
    }
  };

  const [readyOnTime, setReadyOnTime] = useState(true);
  const handleReady = async (e, order) => {
    e.preventDefault();
    try {
      const orderStatus = 'PAID';
      const currentTime = new Date();
      const isReadyOnTime = currentTime < new Date(order.pickUpDateTime);
      let delayedTimeAmount = 0;
      if (!isReadyOnTime) {
        delayedTimeAmount = currentTime - (new Date(order.pickUpDateTime));
      }
      setReadyOnTime(isReadyOnTime);
      submitReadiedOrder(e, {
        ...order,
        readyOnTime: isReadyOnTime,
        delayedTimeAmount,
        orderStatus,
      });
      await axios.delete(`../api/orders/${order.id}`);
      const message = isReadyOnTime
        ? `Order ${order.invoiceNumber} - Ready - ON TIME`
        : `Order ${order.invoiceNumber} - Ready - LATE`;
      const variant = isReadyOnTime ? 'success' : 'warning';
      loadUpdatedActiveOrders(order);
      enqueueSnackbar(message, { variant });
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Error - Ready - Fail', { variant: 'error' });
      setApiError(error?.response?.data?.error || 'Unknown Error');
      console.log(apiError);
    }
  };

  const [expandedRow, setExpandedRow] = useState(null);
  const handleRowClick = (row) => {
    if (expandedRow === row) {
      setExpandedRow(null);
    } else {
      setExpandedRow(row);
    }
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const [searchValue, setSearchValue] = useState('');
  const [sortingMethod, setSortMethod] = useState({ key: null, direction: 'ascending' });
  const [pickUpDateTimeFilter, setPickUpDateTimeFilter] = useState('');

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortingMethod && sortingMethod.key === key && sortingMethod.direction === 'ascending') {
      direction = 'descending';
    }
    setSortMethod({ key, direction });
    setOrders([...orders].sort((a, b) => {
      if (key === 'pickUpDateTime' || key === 'orderTimeLog') {
        const dateA = new Date(a[key]).getTime();
        const dateB = new Date(b[key]).getTime();
        return direction === 'ascending' ? dateA - dateB : dateB - dateA;
      } if (typeof a[key] === 'string' && typeof b[key] === 'string') {
        return direction === 'ascending' ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key]);
      }
      return 0;
    }));
  };

  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearchValue(value);
    setPickUpDateTimeFilter(value);
  };

  const sortedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const searchValueWithoutHyphens = searchValue.replace(/-/g, '');
    return orders
      .filter(
        (order) => {
          const phoneNumberWithoutHyphens = order.phone.replace(/-/g, '');
          return order.invoiceNumber.toString().toLowerCase()
            .includes(searchValueWithoutHyphens.toLowerCase())
            || order.name.toLowerCase().includes(searchValueWithoutHyphens.toLowerCase())
            || phoneNumberWithoutHyphens.toLowerCase()
              .includes(searchValueWithoutHyphens.toLowerCase())
            || order.pickUpDateTime.toLowerCase().includes(pickUpDateTimeFilter.toLowerCase());
        },
      )
      .sort((a, b) => {
        if (sortingMethod.key !== null) {
          if (a[sortingMethod.key] < b[sortingMethod.key]) {
            return sortingMethod.direction === 'ascending' ? -1 : 1;
          }
          if (a[sortingMethod.key] > b[sortingMethod.key]) {
            return sortingMethod.direction === 'ascending' ? 1 : -1;
          }
        }
        return 0;
      })
      .slice(startIndex, endIndex);
  }, [orders, searchValue, pickUpDateTimeFilter, sortingMethod, page, rowsPerPage]);

  return (
    <Paper>
      <SnackbarProvider />
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <TextField
            label="Search"
            variant="outlined"
            value={searchValue}
            fullWidth
            onChange={handleSearchChange}
          />
        </Grid>
        <Grid item xs={7} />
        <Grid item xs={2}>
          <CurrentTimeClock />
        </Grid>
      </Grid>
      <TableContainer component={Paper} elevation={24} sx={{ overflowX: 'initial' }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <Typography component="div">
                  Invoice Number
                  <IconButton type="button" onClick={() => handleSort('invoiceNumber')} size="small">
                    {sortingMethod.key !== 'invoiceNumber' && <SortRounded />}
                    {sortingMethod.key === 'invoiceNumber' && (
                      <span>
                        {sortingMethod.direction === 'ascending' ? <ArrowUpward /> : <ArrowDownward />}
                      </span>
                    )}
                  </IconButton>
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography component="div">
                  Customer Name
                  <IconButton type="button" onClick={() => handleSort('name')} size="small">
                    {sortingMethod.key !== 'name' && <SortRounded />}
                    {sortingMethod.key === 'name' && (
                      <span>
                        {sortingMethod.direction === 'ascending' ? <ArrowUpward /> : <ArrowDownward />}
                      </span>
                    )}
                  </IconButton>
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography component="div">
                  Phone
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography component="div">
                  Order Date/Time
                  <IconButton type="button" onClick={() => handleSort('orderTimeLog')} size="small">
                    {sortingMethod.key !== 'orderTimeLog' && <SortRounded />}
                    {sortingMethod.key === 'orderTimeLog' && (
                      <span>
                        {sortingMethod.direction === 'ascending' ? <ArrowUpward /> : <ArrowDownward />}
                      </span>
                    )}
                  </IconButton>
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography component="div">
                  Pickup Date/Time
                  <IconButton type="button" onClick={() => handleSort('pickUpDateTime')} size="small">
                    {sortingMethod.key !== 'pickUpDateTime' && <SortRounded />}
                    {sortingMethod.key === 'pickUpDateTime' && (
                      <span>
                        {sortingMethod.direction === 'ascending' ? <ArrowUpward /> : <ArrowDownward />}
                      </span>
                    )}
                  </IconButton>
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography component="div">
                  Time Left
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography component="div">
                  Actions
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((order) => (
              <Fragment key={order.invoiceNumber}>
                <TableRow onClick={() => handleRowClick(order)}>
                  <TableCell align="center">{order.invoiceNumber}</TableCell>
                  <TableCell align="center">{order.name}</TableCell>
                  <TableCell align="center">{order.phone}</TableCell>
                  <TableCell align="center">
                    {new Intl.DateTimeFormat('en-US', {
                      weekday: 'short',
                      year: '2-digit',
                      month: 'numeric',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    }).format(new Date(order.orderTimeLog))}
                  </TableCell>
                  <TableCell align="center">
                    {new Intl.DateTimeFormat('en-US', {
                      weekday: 'short',
                      year: '2-digit',
                      month: 'numeric',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    }).format(new Date(order.pickUpDateTime))}
                  </TableCell>
                  <TableCell align="center">
                    <CountdownTimer
                      targetDateTime={order.pickUpDateTime}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <ButtonGroup size="small">
                      <Tooltip title="READY" placement="top">
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReady(e, order);
                          }}
                        >
                          <Check />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="DELETE" placement="top">
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteOrder(order);
                          }}
                        >
                          <DeleteRounded />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="EDIT" placement="top">

                        <IconButton>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                    <Collapse in={expandedRow === order} timeout="auto" unmountOnExit>
                      <Box margin={1}>
                        <OrdersTableEntryInfo order={order} />
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </Fragment>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={orders.length} // Total number of rows
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Paper>
  );
}

export default CurrentOrderTable;
