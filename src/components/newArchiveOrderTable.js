/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import axios from 'axios';
import {
  useState, useContext, useCallback, useEffect, useMemo, Fragment,
} from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Paper, Table, TableContainer, TableHead, TableBody, TableRow, TableCell,
  TablePagination, TextField, Typography, IconButton, ButtonGroup, Collapse, Box, Menu, MenuItem,
} from '@mui/material';
import {
  ArrowUpward, ArrowDownward, SortRounded, CurrencyExchange, Edit,
} from '@mui/icons-material';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { useCurrentUserContext } from '../context/CurrentUserContext';
import DashboardContext from '../context/DashboardContext';
import CurrentTimeClock from './CurrentTimeClock';
import ArchiveOrderExchangeDialog from './ArchiveOrderExchangeDialog';
import OrdersTableEntryInfo from './OrdersTableDetail';
import ItemExchangeTable from './ItemExchangeTable';

function BasicOrderInfoRowEntry({ rowData, loadUpdates }) {
  // convert ms to hh:mm:ss_________________________________________________________
  const timeConverter = (timeInMiliSec) => {
    const convertedSeconds = Math.floor(timeInMiliSec / 1000);
    const hours = Math.floor(convertedSeconds / 3600);
    const minutes = Math.floor((convertedSeconds % 3600) / 60);
    const seconds = convertedSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };
  // _______________________________________________________________________________

  // Dialog related functions, hooks and etc._______________________________________
  const [isExchangeDialogOpen, setIsExchangeDialogOpen] = useState(false);
  const [reasonsForExchange, setReasonsForExchange] = useState({
    incorrectOrder: false,
    damagedProduct: false,
    poorquality: false,
    poorService: false,
    otherReason: false,
  });
  const {
    incorrectOrder, damagedProduct, poorQuality, poorService, otherReason,
  } = reasonsForExchange;

  // _______________________________________________________________________________

  // Edit Button Handler____________________________________________________________
  const [apiError, setApiError] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const editMenuOpen = Boolean(anchorEl);
  const editMenuClickHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const editMenuCloseHandler = () => {
    setAnchorEl(null);
  };

  const moveRowDataToActiveQueue = useCallback(async (e, order) => {
    e.preventDefault();
    try {
      await axios.post('../api/orders', {
        invoiceNumber: order.invoiceNumber,
        name: order.name,
        phone: order.phone,
        zipCode: order.zipCode,
        orderTimeLog: order.orderTimeLog,
        pickUpDateString: order.pickUpDateString,
        pickUpTime: order.pickUpTime,
        pickUpDateTime: order.pickUpDateTime,
        items: order.items,
        subTotal: order.subTotal,
        couponCodeName: order.currentCoupon,
        couponDiscountPercentage: order.couponDiscountPercentage,
        couponDiscountPrice: order.couponDiscountPrice,
        discountedSubTotal: order.discountedSubTotal,
        taxRate: order.taxRate,
        taxAmount: order.taxAmount,
        total: order.total,
      });
      await axios.delete(`../api/archiveOrders/${order.id}`);
      loadUpdates(order);
      enqueueSnackbar('Move to active queue: Success', { variant: 'success' });
    } catch (error) {
      console.error(error);
      setApiError(error?.response?.data?.error || 'Unknown Error');
      enqueueSnackbar('mMve to active queue: Fail', { variant: 'error' });
      console.log(apiError);
    }
  }, [setApiError, apiError, loadUpdates]);

  const deleteRowDataForever = async (order) => {
    try {
      await axios.delete(`../api/archiveOrders/${order.id}`);
      loadUpdates(order);
      enqueueSnackbar('Delete: Success', { variant: 'success' });
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Delete: Fail', { variant: 'error' });
      setApiError(error?.response?.data?.error || 'Unknown Error');
      console.log(apiError);
    }
  };

  // _______________________________________________________________________________

  // api request to update order info_______________________________________________
  const exchangeAndRefundHandler = async () => {
    try {
      const orderStatus = 'REFUNDED';
      const updatedRow = {
        ...rowData,
        orderStatus,
        refundItems: rowData.items.map((item) => ({
          itemId: item.itemId,
          category: item.category,
          quantity: item.quantity,
          key: item.key,
          orderStatus,
          isRefunded: true,
          refundDate: new Date(),
        })),
      };
      await axios.put(`../api/orders/${rowData.id}`, updatedRow);
      enqueueSnackbar(`Refund for order ${rowData.invoiceNumber}: Success`, { variant: 'success' });
    } catch (error) {
      console.error(error);
      enqueueSnackbar(`Refund for order ${rowData.invoiceNumber}: Fail`, { variant: 'error' });
    }
  };
  // ________________________________________________________________________________

  // handlling DetailedOrderInfo Table (Arrow Button)________________________________
  const [isDetailedInfoOpen, setIsDetailedInfoOpen] = useState(false);
  return (
    <>
      <TableRow>
        <TableCell align="center">{rowData.invoiceNumber}</TableCell>
        <TableCell align="center">{rowData.name}</TableCell>
        <TableCell align="center">{rowData.phone}</TableCell>
        <TableCell align="center">
          {new Intl.DateTimeFormat('en-US', {
            weekday: 'short',
            year: '2-digit',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          }).format(new Date(rowData.orderTimeLog))}
        </TableCell>
        <TableCell align="center">
          {new Intl.DateTimeFormat('en-US', {
            weekday: 'short',
            year: '2-digit',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          }).format(new Date(rowData.pickUpDateTime))}
        </TableCell>
        <TableCell align="center">
          {rowData.readyOnTime ? 'Yes' : 'Late'}
        </TableCell>
        <TableCell align="center">
          {timeConverter(rowData.delayedTimeAmount)}
        </TableCell>
        <TableCell align="center">
          {rowData.orderStatus}
        </TableCell>
        <TableCell>
          <ButtonGroup>
            {/* Expanding Table */}
            <IconButton
              size="small"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsDetailedInfoOpen(!isDetailedInfoOpen);
              }}
            >
              <ArrowDownward />
            </IconButton>
            {/* Opening Dialog */}
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setIsExchangeDialogOpen(true);
              }}
            >
              <CurrencyExchange />
            </IconButton>
            <ArchiveOrderExchangeDialog
              rowData={rowData}
              isExchangeDialogOpen={isExchangeDialogOpen}
              setIsExchangeDialogOpen={setIsExchangeDialogOpen}
            />
            {/* Edit Button to Delete and Move it back to active queue */}
            <IconButton
              id="basic-button"
              size="small"
              onClick={(e) => { e.stopPropagation(); editMenuClickHandler(e); }}
              aria-controls={editMenuOpen ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={editMenuOpen ? 'true' : undefined}
            >
              <Edit />
            </IconButton>
            <Menu
              open={editMenuOpen}
              onClose={editMenuCloseHandler}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
              anchorEl={anchorEl}
              anchorOrigin={{
                horizontal: 'left',
              }}
              transformOrigin={{
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={(e) => {
                moveRowDataToActiveQueue(e, rowData);
                editMenuCloseHandler();
              }}
              >
                Move to Active Queue
              </MenuItem>
              <MenuItem onClick={() => { editMenuCloseHandler(); deleteRowDataForever(rowData); }}>
                Delete Forever
              </MenuItem>
            </Menu>
          </ButtonGroup>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={9} sx={{ paddingBottom: 0, paddingTop: 0 }}>
          <Collapse in={isDetailedInfoOpen} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <OrdersTableEntryInfo order={rowData} />
            </Box>
            {
              (rowData.anyReturns)
                ? (
                  <Box margin={1}>
                    #Need to fix this part
                    {/* <ItemExchangeTable order={rowData} /> */}
                  </Box>
                )
                : null
            }
          </Collapse>
        </TableCell>
      </TableRow>
    </>

  );
}

function NewArchiveTable() {
  const { currentUser } = useCurrentUserContext();
  const [searchValue, setSearchValue] = useState('');
  const [sortingMethod, setSortMethod] = useState({ key: null, direction: 'ascending' });
  const [pickUpDateTimeFilter, setPickUpDateTimeFilter] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // ______________________footer pagination and rows/page handlers___________________________
  const [page, setPage] = useState(0);
  const tablefooterPageChangeHandler = (e, newPage) => setPage(newPage);
  const tableFooterRowsPerPageHandler = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };
  // _________________________________________________________________________________________

  // ______________________load archive order list from the backend___________________________
  const [archiveOrders, setArchiveOrders] = useState([]);
  const [apiError, setApiError] = useState('');
  useEffect(
    () => {
      if (currentUser.access === 'admin') {
        const ws = new WebSocket(`${(
          window.location.protocol === 'https:' ? 'wss://' : 'ws://'
        )}${window.location.host}/ws-cafe/`);
        ws.onopen = () => {
          // console.log('WebSocket Connected');
        };
        ws.onerror = (e) => {
          console.error(e);
        };
        ws.onmessage = (message) => {
          // console.log('OrdersCurrentTable Component:');
          // console.log('Received WebSocket message:', message.data);
          try {
            const parsedMessage = JSON.parse(message.data);
            if (parsedMessage.type === 'archiveOrders') {
              const oldOrders = parsedMessage.data;
              setArchiveOrders(oldOrders);
            }
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
          setArchiveOrders([]);
        };
      }
      return () => {};
    },
    [currentUser, apiError],
  );

  const loadUpdatedArchiveOrders = (order) => {
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
        if (parsedMessage.type === 'archiveOrders') {
          const oldOrders = parsedMessage.data;
          setArchiveOrders(oldOrders);
        }
      } catch (error) {
        console.error('Error: ', error);
        enqueueSnackbar('Loading Data: Failed', { variant: 'error' });
        setApiError(error?.response?.data?.error || 'Unknown Error');
        console.log(apiError);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket Disconnected');
      ws.close();
      setArchiveOrders([]);
    };
  };

  // _________________________________________________________________________________________

  // _______________________________sort, filter, serach______________________________________
  const sortButtonClickHandler = (key) => {
    let direction = 'ascending';
    if (sortingMethod && sortingMethod.key === key && sortingMethod.direction === 'ascending') {
      direction = 'descending';
    }
    setSortMethod({ key, direction });
    setArchiveOrders([...archiveOrders].sort((a, b) => {
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

  const searchChangeHandler = (e) => {
    const { value } = e.target;
    setSearchValue(value);
    setPickUpDateTimeFilter(value);
  };

  const sortedDataRows = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const searchValueWithoutHyphens = searchValue.replace(/-/g, '');
    return archiveOrders
      .filter((order) => {
        const phoneNumberWithoutHyphens = order.phone.replace(/-/g, '');
        return (
          order.invoiceNumber.toString().toLowerCase().includes(
            searchValueWithoutHyphens.toLowerCase(),
          )
          || order.name.toLowerCase().includes(searchValueWithoutHyphens.toLowerCase())
          || phoneNumberWithoutHyphens.toLowerCase().includes(
            searchValueWithoutHyphens.toLowerCase(),
          )
          || order.pickUpDateTime.toLowerCase().includes(
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
  }, [archiveOrders, searchValue, pickUpDateTimeFilter, sortingMethod, page, rowsPerPage]);
  // _________________________________________________________________________________________

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
            onChange={searchChangeHandler}
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
                <Typography component="p">
                  Invoice Number
                  <IconButton
                    type="button"
                    onClick={
                      () => {
                        sortButtonClickHandler('invoiceNumber');
                      }
                    }
                    size="small"
                  >
                    {sortingMethod.key !== 'invoiceNumber' && <SortRounded />}
                    {sortingMethod.key === 'invoiceNumber' && (
                      <span>
                        {sortingMethod.direction === 'ascending'
                          ? <ArrowUpward /> : <ArrowDownward />}
                      </span>
                    )}
                  </IconButton>
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography component="p">
                  Customer Name
                  <IconButton
                    type="button"
                    onClick={() => sortButtonClickHandler('name')}
                    size="small"
                  >
                    {sortingMethod.key !== 'name' && <SortRounded />}
                    {sortingMethod.key === 'name' && (
                      <span>
                        {sortingMethod.direction === 'ascending'
                          ? <ArrowUpward /> : <ArrowDownward />}
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
                  <IconButton
                    type="button"
                    onClick={() => sortButtonClickHandler('orderTimeLog')}
                    size="small"
                  >
                    {sortingMethod.key !== 'orderTimeLog' && <SortRounded />}
                    {sortingMethod.key === 'orderTimeLog' && (
                      <span>
                        {sortingMethod.direction === 'ascending'
                          ? <ArrowUpward /> : <ArrowDownward />}
                      </span>
                    )}
                  </IconButton>
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography component="p">
                  Pickup Date/Time
                  <IconButton
                    type="button"
                    onClick={() => sortButtonClickHandler('pickUpDateTime')}
                    size="small"
                  >
                    {sortingMethod.key !== 'pickUpDateTime' && <SortRounded />}
                    {sortingMethod.key === 'pickUpDateTime' && (
                      <span>
                        {sortingMethod.direction === 'ascending'
                          ? <ArrowUpward /> : <ArrowDownward />}
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
            {sortedDataRows.map((rowData) => (
              <BasicOrderInfoRowEntry
                rowData={rowData}
                loadUpdates={loadUpdatedArchiveOrders}
              />
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={archiveOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={tablefooterPageChangeHandler}
          onRowsPerPageChange={tableFooterRowsPerPageHandler}
        />
      </TableContainer>
    </Paper>
  );
}

export default NewArchiveTable;
