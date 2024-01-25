/* eslint-disable no-unused-vars */
import axios from 'axios';
import {
  useEffect, useState, useContext, useMemo, Fragment, useCallback,
} from 'react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Paper,
  Checkbox,
  Typography,
  Collapse,
  Box,
  TextField,
  Container,
  TablePagination,
  IconButton,
  ButtonGroup,
} from '@mui/material';
import {
  DeleteRounded, CheckCircleRounded, SentimentDissatisfied, Info, Check,
  SentimentSatisfiedAlt, ArrowUpward, ArrowDownward, SortRounded,
} from '@mui/icons-material';
import OrderContext from '../context/OrderContext';
import { useCurrentUserContext } from '../context/CurrentUserContext';
import CurrentTime from './OrdersTableTimer';
import CountdownTimer from './OrdersTableCountdown';
import OrdersTableEntryInfo from './OrdersTableDetail';
import CurrentTimeClock from './CurrentTimeClock';

function CurrentOrderTable() {
  const {
    macItems, drinkItems, packItems, optionalItems,
  } = useContext(OrderContext);

  const [orders, setOrders] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);

  const [searchValue, setSearchValue] = useState('');
  const [sortingMethod, setSortMethod] = useState({ key: null, direction: 'ascending' });
  const [pickUpDateTimeFilter, setPickUpDateTimeFilter] = useState('');

  const { currentUser } = useCurrentUserContext();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // const loadOrders = () => {
  //   axios.get('/api/orders')
  //     .then((result) => setOrders(result.data))
  //     .catch(console.error);
  // };

  // useEffect(
  //   () => {
  //     if (currentUser.access === 'admin') {
  //       loadOrders();
  //       return () => {
  //         setOrders([]);
  //       };
  //     }
  //     return () => { };
  //   },
  //   [currentUser],
  // );

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     loadOrders();
  //   }, 5000); // Polling interval in milliseconds (e.g., 5000ms = 5 seconds)
  //   return () => clearInterval(interval);
  // }, []); // Run only once on mount

  const loadOrders = useCallback(async () => {
    try {
      const result = await axios.get('../api/orders');
      const newExpandedRow = result.data.find((order) => order.id === expandedRow?.id);
      setOrders(result.data);
      setExpandedRow(newExpandedRow || null);
    } catch (error) {
      console.error(error);
    }
  }, [expandedRow?.id]);

  useEffect(() => {
    if (currentUser.access === 'admin') {
      loadOrders();
    }

    const interval = setInterval(() => {
      loadOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentUser.access, loadOrders]);

  const deleteOrder = async (order) => {
    try {
      await axios.delete(`../api/orders/${order.id}`);
      loadOrders();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRowClick = (row) => {
    if (expandedRow === row) {
      setExpandedRow(null);
    } else {
      setExpandedRow(row);
    }
  };

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

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchValue(value);
    setPickUpDateTimeFilter(value);
  };

  const sortedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const searchValueWithoutHyphens = searchValue.replace(/-/g, '');
    return orders
      .filter(
        (row) => {
          const phoneNumberWithoutHyphens = row.phone.replace(/-/g, '');
          return row.invoiceNumber.toString().toLowerCase()
            .includes(searchValueWithoutHyphens.toLowerCase())
            || row.name.toLowerCase().includes(searchValueWithoutHyphens.toLowerCase())
            || phoneNumberWithoutHyphens.toLowerCase()
              .includes(searchValueWithoutHyphens.toLowerCase())
            || row.pickUpDateTime.toLowerCase().includes(pickUpDateTimeFilter.toLowerCase());
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
      <TableContainer component={Paper} elevation={24} sx={{ overflowX: 'initial' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell colSpan={2}>
                <TextField
                  label="Search"
                  variant="outlined"
                  value={searchValue}
                  fullWidth
                  onChange={handleSearchChange}
                />
              </TableCell>
              <TableCell colSpan={5} align="right">
                <CurrentTimeClock />
              </TableCell>
            </TableRow>
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
                Phone
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
              <TableCell align="center">Time Left</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((row) => (
              <Fragment key={row.invoiceNumber}>
                <TableRow onClick={() => handleRowClick(row)}>
                  <TableCell align="center">{row.invoiceNumber}</TableCell>
                  <TableCell align="center">{row.name}</TableCell>
                  <TableCell align="center">{row.phone}</TableCell>
                  <TableCell align="center">
                    {new Intl.DateTimeFormat('en-US', {
                      weekday: 'short',
                      year: '2-digit',
                      month: 'numeric',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    }).format(new Date(row.orderTimeLog))}
                  </TableCell>
                  <TableCell align="center">
                    {new Intl.DateTimeFormat('en-US', {
                      weekday: 'short',
                      year: '2-digit',
                      month: 'numeric',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    }).format(new Date(row.pickUpDateTime))}
                  </TableCell>

                  <TableCell align="center">
                    <CountdownTimer targetDateTime={row.pickUpDateTime} />
                  </TableCell>
                  <TableCell align="center">
                    <ButtonGroup orientation="vertical" variant="text" size="small">
                      <Button
                        startIcon={<Check />}
                        onClick={(e) => { e.stopPropagation(); }}
                      >
                        Ready
                      </Button>
                      <Button
                        startIcon={<DeleteRounded />}
                        onClick={(e) => { e.stopPropagation(); deleteOrder(row); }}
                      >
                        Delete
                      </Button>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                    <Collapse in={expandedRow === row} timeout="auto" unmountOnExit>
                      <Box margin={1}>
                        <OrdersTableEntryInfo order={row} />
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
