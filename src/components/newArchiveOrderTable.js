/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import axios from 'axios';
import {
  useState, useContext, useCallback, useEffect, useMemo, Fragment,
} from 'react';
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

function BasicOrderInfoRowEntry({ rowData }) {
  const [apiError, setApiError] = useState('');

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
  const [anchorEl, setAnchorEl] = useState(null);
  const editMenuOpen = Boolean(anchorEl);
  const editMenuClickHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const editMenuCloseHandler = () => {
    setAnchorEl(null);
  };

  const moveRowDataToActiveQueue = useCallback(async (e, orderData) => {
    e.preventDefault();
    try {
      await axios.post('../api/orders', {
        invoiceNumber: orderData.invoiceNumber,
        name: orderData.name,
        phone: orderData.phone,
        zipCode: orderData.zipCode,
        orderTimeLog: orderData.orderTimeLog,
        pickUpDateString: orderData.pickUpDateString,
        pickUpTime: orderData.pickUpTime,
        pickUpDateTime: orderData.pickUpDateTime,
        items: orderData.items,
        subTotal: orderData.subTotal,
        couponCodeName: orderData.currentCoupon,
        couponDiscountPercentage: orderData.couponDiscountPercentage,
        couponDiscountPrice: orderData.couponDiscountPrice,
        discountedSubTotal: orderData.discountedSubTotal,
        taxRate: orderData.taxRate,
        taxAmount: orderData.taxAmount,
        total: orderData.total,
      });
      await axios.delete(`../api/archiveOrders/${orderData.id}`);
      enqueueSnackbar('move to active queue: success', { variant: 'success' });
    } catch (error) {
      console.error(error);
      setApiError(error?.response?.data?.error || 'Unknown Error');
      enqueueSnackbar('move to active queue: error', { variant: 'error' });
      console.log(apiError);
    }
  }, [setApiError, apiError]);

  const deleteRowDataForever = async (order) => {
    try {
      await axios.delete(`../api/archiveOrders/${order.id}`);
      enqueueSnackbar('delete order: success', { variant: 'success' });
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Something failed', { variant: 'error' });
    }
  };

  // _______________________________________________________________________________

  // api request to update order info_______________________________________________
  const ExchangeAndRefundHandler = async () => {
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
      enqueueSnackbar(`Refund for order ${rowData.invoiceNumber} successful`, { variant: 'success' });
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Refund failed: Error', { variant: 'error' });
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
              (rowData.orderStatus === 'EXCHANGED' || rowData.orderStatus === 'REFUNDED')
                ? (
                  <Box margin={1}>
                    <ItemExchangeTable order={rowData} />
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
  const [archiveOrder, setArchiveOrder] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [sortingMethod, setSortMethod] = useState({ key: null, direction: 'ascending' });
  const [pickUpDateTimeFilter, setPickUpDateTimeFilter] = useState('');
  const { setArchiveOrders, submitReadiedOrder, archiveOrders } = useContext(DashboardContext);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // ______________________footer pagination and rows/page handlers___________________________
  const [page, setPage] = useState(0);
  const tablefooterPageChangeHandler = (event, newPage) => setPage(newPage);
  const tableFooterRowsPerPageHandler = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  // _________________________________________________________________________________________

  // ______________________load archive order list from the backend___________________________
  const [orders, setOrders] = useState([]);
  const { currentUser } = useCurrentUserContext();
  const loadOrders = useCallback(async () => {
    try {
      const result = await axios.get('../api/archiveOrders');
      // const newExpandedRow = result.data.find((order) => order.id === expandedRow?.id);
      setOrders(result.data);
      // setExpandedRow(newExpandedRow || false);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (currentUser.access === 'admin') {
      loadOrders();
    }
    const interval = setInterval(loadOrders, 3000);
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
  // _________________________________________________________________________________________

  // _______________________________sort, filter, serach______________________________________
  const sortButtonClickHandler = (key) => {
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

  const searchChangeHandler = (event) => {
    const { value } = event.target;
    setSearchValue(value);
    setPickUpDateTimeFilter(value);
  };

  const sortedDataRows = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const searchValueWithoutHyphens = searchValue.replace(/-/g, '');
    return orders
      .filter((rowData) => {
        const phoneNumberWithoutHyphens = rowData.phone.replace(/-/g, '');
        return (
          rowData.invoiceNumber.toString().toLowerCase().includes(
            searchValueWithoutHyphens.toLowerCase(),
          )
          || rowData.name.toLowerCase().includes(searchValueWithoutHyphens.toLowerCase())
          || phoneNumberWithoutHyphens.toLowerCase().includes(
            searchValueWithoutHyphens.toLowerCase(),
          )
          || rowData.pickUpDateTime.toLowerCase().includes(
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
  // _________________________________________________________________________________________

  return (
    <Paper>
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
      <SnackbarProvider />
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
              <BasicOrderInfoRowEntry rowData={rowData} />
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={orders.length}
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
