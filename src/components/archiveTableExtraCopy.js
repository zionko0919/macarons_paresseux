/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import axios from 'axios';
import React, {
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
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
} from '@mui/material';
import {
  DeleteRounded,
  CheckCircleRounded,
  SentimentDissatisfied,
  Info,
  Check,
  Edit,
  SentimentSatisfiedAlt,
  ArrowUpward,
  ArrowDownward,
  SortRounded,
  Close,
  CurrencyExchange,
} from '@mui/icons-material';
import OrderContext from '../context/OrderContext';
import { useCurrentUserContext } from '../context/CurrentUserContext';
import DashboardContext from '../context/DashboardContext';
import CurrentTime from './OrdersTableTimer';
import CountdownTimer from './OrdersTableCountdown';
import OrdersTableEntryInfo from './OrdersTableDetail';
import CurrentTimeClock from './CurrentTimeClock';
import ExchangeDialog from './ExchangeModal';

function ArchieveOrderTable() {
  const {
    macItems, drinkItems, packItems, optionalItems,
  } = useContext(OrderContext);
  const [orders, setOrders] = useState([]);
  const [expandedRow, setExpandedRow] = useState(false);
  const [readyOnTime, setReadyOnTime] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [sortingMethod, setSortMethod] = useState({ key: null, direction: 'ascending' });
  const [pickUpDateTimeFilter, setPickUpDateTimeFilter] = useState('');
  const { currentUser } = useCurrentUserContext();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { setArchiveOrders, submitReadiedOrder, archiveOrders } = useContext(DashboardContext);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const loadOrders = useCallback(async () => {
    try {
      const result = await axios.get('../api/archiveOrders');
      const newExpandedRow = result.data.find((order) => order.id === expandedRow?.id);
      setOrders(result.data);
      setExpandedRow(newExpandedRow || false);
    } catch (error) {
      console.error(error);
    }
  }, [expandedRow?.id]);

  useEffect(() => {
    if (currentUser.access === 'admin') {
      loadOrders();
    }

    const interval = setInterval(loadOrders, 1000000000);

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

  const handleReady = (e, row) => {
    const currentTime = new Date();
    const isReadyOnTime = currentTime < new Date(row.pickUpDateTime);
    setReadyOnTime(isReadyOnTime);
    submitReadiedOrder(e, { ...row, readyOnTime: isReadyOnTime });
    deleteOrder(row);
  };

  const handleRowClick = (row) => {
    if (expandedRow === row) {
      setExpandedRow(false);
      console.log('close row');
    } else {
      setExpandedRow(row);
      console.log('open row');
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

  const [apiError, setApiError] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const handleReturn = async (e, row) => {
    e.preventDefault();
    try {
      const orderStatus = 'RETURNED';
      const returnedDate = new Date();
      await axios.put(`../api/archiveOrders/${row.id}`, { ...row, orderStatus, returnedDate });
      loadOrders();
      setDialogOpen(false);
    } catch (error) {
      console.error(error);
      setApiError(error?.response?.data?.error || 'Unknown Error');
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const handleClickOpen = () => setIsOpen(true);
  const handleClickClose = () => setIsOpen(false);

  const sortedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const searchValueWithoutHyphens = searchValue.replace(/-/g, '');
    return orders
      .filter((row) => {
        const phoneNumberWithoutHyphens = row.phone.replace(/-/g, '');
        return (
          row.invoiceNumber.toString().toLowerCase().includes(
            searchValueWithoutHyphens.toLowerCase(),
          )
          || row.name.toLowerCase().includes(searchValueWithoutHyphens.toLowerCase())
          || phoneNumberWithoutHyphens.toLowerCase().includes(
            searchValueWithoutHyphens.toLowerCase(),
          )
          || row.pickUpDateTime.toLowerCase().includes(
            pickUpDateTimeFilter.toLowerCase(),
          )
        );
      })
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

  const timeConversion = (timeInMiliSec) => {
    const convertedSeconds = Math.floor(timeInMiliSec / 1000);
    const hours = Math.floor(convertedSeconds / 3600);
    const minutes = Math.floor((convertedSeconds % 3600) / 60);
    const seconds = convertedSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <Paper>
      <Container>
        <TextField
          label="Search"
          variant="outlined"
          value={searchValue}
          fullWidth
          onChange={handleSearchChange}
        />
        <CurrentTimeClock />
      </Container>
      <TableContainer component={Paper} elevation={24} sx={{ overflowX: 'initial' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <Typography component="p">
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
                <Typography component="p">
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
                <Typography component="p">
                  Phone
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography component="p">
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
                <Typography component="p">
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
                <Typography component="p">
                  Ready in Time
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography component="p">
                  Delayed Time
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography component="p">
                  Status
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography component="p">
                  Actions
                </Typography>
              </TableCell>
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
                    {row.readyOnTime ? 'Yes' : 'Late'}
                  </TableCell>
                  <TableCell align="center">
                    {timeConversion(row.delayedTimeAmount)}
                  </TableCell>
                  <TableCell align="center">
                    {row.orderStatus}
                  </TableCell>

                  <TableCell align="center">
                    <ButtonGroup variant="text">
                      <Button
                        startIcon={<CurrencyExchange />}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        size="small"
                      >
                        RETURN
                      </Button>
                      <ExchangeDialog isOpen={dialogOpen} onClose={() => setDialogOpen(false)} />

                      <Button
                        startIcon={<Edit />}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        size="small"
                      >
                        EDIT
                      </Button>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
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
          count={orders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Paper>
  );
}

export default ArchieveOrderTable;
