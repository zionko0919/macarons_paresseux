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
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
  Grid,
  FormGroup,
  Select,
  MenuItem,
  Menu,
} from '@mui/material';
import {
  Edit,
  ArrowUpward,
  ArrowDownward,
  SortRounded,
  CurrencyExchange,
} from '@mui/icons-material';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import OrderContext from '../context/OrderContext';
import { useCurrentUserContext } from '../context/CurrentUserContext';
import DashboardContext from '../context/DashboardContext';
import OrdersTableEntryInfo from './OrdersTableDetail';
import CurrentTimeClock from './CurrentTimeClock';
import ArchieveOrderStatusInfo from './ArchiveOrderStatusInfoTable';
import ItemExchangeTable from './ItemExchangeTable';

function RowClikableHeader({ row }) {
  const {
    macItems, drinkItems, packItems, macList, macListDispatch,
  } = useContext(OrderContext);
  const { currentUser } = useCurrentUserContext();
  const [currentOrders, setCurrentOrders] = useState([]);
  const [isClickableHeaderOpen, setIsClickableHeaderOpen] = useState(false);
  const [isExchangeDialogOpen, setIsExchangeDialogOpen] = useState(false);
  const [exchageTypeValue, setExchangeTypeValue] = useState('EXCHANGED');
  const [exchangeReason, setExchangeReason] = useState({
    incorrectOrder: false,
    damagedProduct: false,
    poorQuality: false,
    poorService: false,
    otherReason: false,
  });
  const [exchangeTotalAmount, setExchangeTotalAmount] = useState(0);

  const {
    incorrectOrder, damagedProduct, poorQuality, poorService, otherReason,
  } = exchangeReason;

  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [exchangeItemList, setExchangeItemList] = useState([]);

  const handleExchangeItemList = (
    itemId,
    category,
    quantity,
    key,
    orderStatus,
    exchangeDate,
  ) => {
    console.log();
    setExchangeItemList([...exchangeItemList, {
      itemId,
      category,
      quantity,
      key,
      orderStatus,
      isRefunded: orderStatus === 'REFUNDED',
      exchangeDate,
      exchangeReason,
    }]);
    // console.log(exchangeItemList);
  };

  const handleQuantityChange = (itemId, quantity) => {
    setSelectedQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: quantity,
    }));
  };

  useEffect(() => {
    const calculateTotal = () => row.items.reduce((total, item) => {
      let exchangePrice = 0;
      const packItem = packItems.find((i) => i.itemId === item.itemId);
      const drinkItem = drinkItems.find((i) => i.itemId === item.itemId);

      if (packItem) {
        if (item.giftOption.isGiftOptionSelected) {
          exchangePrice += 2;
        }
        exchangePrice += packItem.price;
      } else if (drinkItem) {
        exchangePrice += drinkItem.price;
      }

      if (selectedQuantities[item.itemId] === undefined) {
        exchangePrice = 0;
      }
      return total + exchangePrice * (selectedQuantities[item.itemId] || 0);
    }, 0);

    setExchangeTotalAmount(calculateTotal());
  }, [selectedQuantities, row.items, drinkItems, packItems]);

  const handleExchangeTotalAmount = (e) => {
    setExchangeTotalAmount(e);
  };

  const handleExchangeReasonCheckBox = (e) => {
    setExchangeReason({
      ...exchangeReason,
      [e.target.name]: e.target.checked,
    });
  };

  const handleExchangeDialogClose = () => {
    setExchangeTypeValue('EXCHANGED');
    setSelectedQuantities({});
    setExchangeReason({
      incorrectOrder: false,
      damagedProduct: false,
      poorQuality: false,
      poorService: false,
      otherReason: false,
    });
    setExchangeTotalAmount(0);
    setIsExchangeDialogOpen(false);
  };

  const handleExchangeRadioChange = (e) => {
    setExchangeTypeValue(e.target.value);
  };

  const handleExchangeSubmit = async (e) => {
    e.preventDefault();
    // console.log(exchangeItemList);
    try {
      const orderStatus = exchageTypeValue;
      const problem = exchangeReason;
      const exchangeDate = new Date();
      const exchangeItems = selectedQuantities;
      const formattedExchangeDate = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
        timeZone: 'America/Chicago', // Central Time (US)
      }).format(exchangeDate);

      // Create a copy of the row and update the necessary fields
      const updatedRow = {
        ...row,
        orderStatus,
        problem,
        formattedExchangeDate,
        exchangeItems,
        exchangeItemInfo: exchangeItemList,
      };

      // Make the axios.put request
      await axios.put(`../api/archiveOrders/${row.id}`, updatedRow);
      const message = (exchageTypeValue === 'EXCHANGED')
        ? `order ${row.invoiceNumber} exchange: success`
        : `order ${row.invoiceNumber} return: success`;
      enqueueSnackbar(message, { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Something failed', { variant: 'error' });
      console.error(error);
    }
  };

  const timeConverter = (timeInMiliSec) => {
    const convertedSeconds = Math.floor(timeInMiliSec / 1000);
    const hours = Math.floor(convertedSeconds / 3600);
    const minutes = Math.floor((convertedSeconds % 3600) / 60);
    const seconds = convertedSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const editOpen = Boolean(anchorEl);
  const handleEditClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleEditClose = () => {
    setAnchorEl(null);
  };

  const [apiError, setApiError] = useState('');
  const deleteArchiveOrder = async (order) => {
    try {
      await axios.delete(`../api/archiveOrders/${order.id}`);
      // loadOrders();
      enqueueSnackbar('delete order: success', { variant: 'success' });
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Something failed', { variant: 'error' });
    }
  };
  const handleMoveToActiveOrder = useCallback(async (e, order) => {
    e.preventDefault();
    setApiError('');
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
      enqueueSnackbar('move to active queue: success', { variant: 'success' });
    } catch (error) {
      console.error(error);
      setApiError(error?.response?.data?.error || 'Unknown Error');
      enqueueSnackbar('move to active queue: error', { variant: 'error' });
      console.log(apiError);
    }
  }, [setApiError, apiError]);

  return (
    <>
      <TableRow>
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
          {timeConverter(row.delayedTimeAmount)}
        </TableCell>
        <TableCell align="center">
          {row.orderStatus}
        </TableCell>
        <TableCell align="center">
          <ButtonGroup variant="text">
            <IconButton
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsClickableHeaderOpen(!isClickableHeaderOpen);
              }}
            >
              <ArrowDownward />
            </IconButton>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setIsExchangeDialogOpen(true);
              }}
              size="small"
            >
              <CurrencyExchange />
            </IconButton>
            <Dialog open={isExchangeDialogOpen} onClose={() => setIsExchangeDialogOpen(false)}>
              <DialogTitle>
                Exchanging Invoice Number:
                {' '}
                {row.invoiceNumber}
              </DialogTitle>
              <form
                onSubmit={
                  (e) => handleExchangeSubmit(
                    e,
                    exchageTypeValue,
                    exchangeReason,
                    selectedQuantities,
                  )
                }
              >
                <DialogContent>
                  <FormControl size="small">
                    <FormLabel>Exchange Type:</FormLabel>
                    <Container>
                      <RadioGroup defaultValue="EXCHANGED" value={exchageTypeValue} onChange={handleExchangeRadioChange}>
                        <FormControlLabel value="REFUNDED" control={<Radio />} label="Return" />
                        <FormControlLabel value="EXCHANGED" control={<Radio />} label="Exchange" />
                      </RadioGroup>
                    </Container>
                  </FormControl>
                </DialogContent>
                <DialogContent>
                  <FormControl size="small sx={{ m: 1, minWidth: 120 }}">
                    <FormLabel>Items to Return/Exchange:</FormLabel>
                    <Container align="center">
                      <TableContainer align="center">
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell align="center">Item</TableCell>
                              <TableCell align="center">Gift</TableCell>
                              <TableCell align="center">Qty</TableCell>
                              <TableCell align="center">Price</TableCell>
                            </TableRow>
                          </TableHead>
                          {row.items.map((item) => {
                            let title = 'Error'; // Default title
                            let exchangePrice = 0;
                            const packItem = packItems.find((i) => i.itemId === item.itemId);
                            const drinkItem = drinkItems.find((i) => i.itemId === item.itemId);

                            if (packItem) {
                              if (item.giftOption.isGiftOptionSelected) {
                                exchangePrice += 2;
                              }
                              title = packItem.title;
                              exchangePrice += packItem.price;
                            } else if (drinkItem) {
                              title = drinkItem.title;
                              exchangePrice = drinkItem.price;
                            }

                            const options = [0,
                              ...Array.from(
                                { length: item.quantity },
                                (_, index) => index + 1,
                              )];

                            let totalExchangePrice = 0;
                            totalExchangePrice += exchangePrice * selectedQuantities[item.itemId];
                            return (
                              <TableBody>
                                <TableRow key={item.itemId}>
                                  <TableCell size="small">
                                    <Typography variant="div">{title}</Typography>
                                  </TableCell>
                                  <TableCell align="center">
                                    <Typography variant="div">
                                      {(() => {
                                        if (item.giftOption) {
                                          return item.giftOption.isGiftOptionSelected ? 'O' : 'X';
                                        }
                                        return 'X';
                                      })()}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="right">
                                    <FormControl size="small">
                                      <Select
                                        defaultValue={0}
                                        onChange={
                                        (event) => {
                                          handleQuantityChange(
                                            item.itemId,
                                            event.target.value,
                                          );
                                          handleExchangeItemList(
                                            item.itemId,
                                            item.category,
                                            event.target.value,
                                            item.key,
                                            exchageTypeValue,
                                            new Date(),
                                          );
                                        }
                                      }
                                      >
                                        {options.map((option) => (
                                          <MenuItem key={option} value={option}>
                                            <Typography variant="body2">{option}</Typography>
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="p">
                                      $
                                      {' '}
                                      {Number.isNaN(exchangePrice * selectedQuantities[item.itemId])
                                        ? (exchangePrice * 0).toFixed(2)
                                        : (exchangePrice
                                      * selectedQuantities[item.itemId]).toFixed(2)}

                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            );
                          })}
                          <TableBody>
                            <TableRow>
                              <TableCell
                                align="center"
                                colSpan={3}
                                sx={{ fontWeight: 'bold' }}
                              >
                                <Typography variant="p">
                                  Exchange Total:
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  variant="p"
                                  sx={{ fontWeight: 'bold' }}
                                >
                                  $
                                  {exchangeTotalAmount.toFixed(2)}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Container>
                  </FormControl>
                </DialogContent>
                <DialogContent>
                  <FormControl size="small">
                    <FormLabel>Reason Type:</FormLabel>
                    <Container>
                      <FormGroup>
                        <FormControlLabel
                          control={(
                            <Checkbox
                              size="small"
                              checked={incorrectOrder}
                              onChange={handleExchangeReasonCheckBox}
                              name="incorrectOrder"
                            />
                        )}
                          label="incorrect order"
                        />
                        <FormControlLabel
                          control={(
                            <Checkbox
                              size="small"
                              checked={damagedProduct}
                              onChange={handleExchangeReasonCheckBox}
                              name="damagedProduct"
                            />
                        )}
                          label="product damaged"
                        />
                        <FormControlLabel
                          control={(
                            <Checkbox
                              size="small"
                              checked={poorQuality}
                              onChange={handleExchangeReasonCheckBox}
                              name="poorQuality"
                            />
                        )}
                          label="poor product quality/condition"
                        />
                        <FormControlLabel
                          control={(
                            <Checkbox
                              size="small"
                              checked={poorService}
                              onChange={handleExchangeReasonCheckBox}
                              name="poorService"
                            />
                        )}
                          label="poor service"
                        />
                        <FormControlLabel
                          control={(
                            <Checkbox
                              size="small"
                              checked={otherReason}
                              onChange={handleExchangeReasonCheckBox}
                              name="otherReason"
                            />
                        )}
                          label="other"
                        />
                      </FormGroup>
                    </Container>
                  </FormControl>
                </DialogContent>
                <DialogContent dividers align="right">
                  <Button
                    type="button"
                    onClick={(e) => {
                      handleExchangeSubmit(e);
                      handleExchangeDialogClose();
                    }}
                  >
                    SUBMIT
                  </Button>
                  {/* <Button type="submit" onClick={handleExchangeDialogClose}>SUBMIT2</Button> */}
                  <Button type="button" onClick={handleExchangeDialogClose}>CANCEL</Button>
                </DialogContent>

              </form>
            </Dialog>
            <IconButton
              id="basic-button"
              onClick={(e) => {
                e.stopPropagation();
                handleEditClick(e);
              }}
              size="small"
              aria-controls={editOpen ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={editOpen ? 'true' : undefined}
            >
              <Edit />
            </IconButton>
            <Menu
              open={editOpen}
              onClose={handleEditClose}
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
              <MenuItem
                onClick={
                  (e) => {
                    handleEditClose();
                    handleMoveToActiveOrder(e, row);
                    // console.log('hi: ', row.invoiceNumber);
                  }
                }
              >
                Move to Active Order
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleEditClose();
                  deleteArchiveOrder(row);
                }}
              >
                Delete
              </MenuItem>
            </Menu>
          </ButtonGroup>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
          <Collapse in={isClickableHeaderOpen} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <OrdersTableEntryInfo order={row} />
            </Box>
            {
              (row.orderStatus === 'EXCHANGED' || row.orderStatus === 'REFUNDED')
                ? (
                  <Box margin={1}>
                    {/* <ItemExchangeTable order={row} /> */}
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

function ArchieveOrderTable() {
  const {
    macItems, drinkItems, packItems, optionalItems,
  } = useContext(OrderContext);
  const [orders, setOrders] = useState([]);
  // const [expandedRow, setExpandedRow] = useState(false);
  // const [readyOnTime, setReadyOnTime] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [sortingMethod, setSortMethod] = useState({ key: null, direction: 'ascending' });
  const [pickUpDateTimeFilter, setPickUpDateTimeFilter] = useState('');
  const { currentUser } = useCurrentUserContext();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { setArchiveOrders, submitReadiedOrder, archiveOrders } = useContext(DashboardContext);
  const [currentOrders, setCurrentOrders] = useState([]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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

  const handleReturn = async (e, row, type, reason) => {
    e.preventDefault();
    try {
      const orderStatus = type;
      const exchangeReason = reason;
      const returnedDate = new Date();
      await axios.put(`../api/archiveOrders/${row.id}`, {
        ...row, orderStatus, returnedDate, exchangeReason,
      });
      loadOrders();
    } catch (error) {
      console.error(error);
      setApiError(error?.response?.data?.error || 'Unknown Error');
      console.log(apiError);
    }
  };

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

  return (
    <Paper>
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
                      handleSort('invoiceNumber');
                    }
}
                    size="small"
                  >
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
              <RowClikableHeader
                row={row}
              />
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
