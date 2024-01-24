/* eslint-disable no-unused-vars */
import axios from 'axios';
import {
  useEffect, useState, useContext, useMemo, Fragment,
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
} from '@mui/material';
import {
  DeleteRounded, CheckCircleRounded, SentimentDissatisfied,
  SentimentSatisfiedAlt, ArrowUpward, ArrowDownward, SortRounded,
} from '@mui/icons-material';
import OrderContext from '../context/OrderContext';
import { useCurrentUserContext } from '../context/CurrentUserContext';
import CurrentTime from './OrdersTableTimer';
import CountdownTimer from './OrdersTableCountdown';
import OrdersTableEntryInfo from './OrdersTableDetail';

function CurrentOrderTable() {
  const {
    macItems, drinkItems, packItems, optionalItems,
  } = useContext(OrderContext);

  const [orders, setOrders] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
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

  useEffect(() => {
    const interval = setInterval(() => {
      loadOrders();
    }, 5000000); // Polling interval in milliseconds (e.g., 5000ms = 5 seconds)

    return () => clearInterval(interval);
  }, []); // Run only once on mount

  const deleteOrder = async (order) => {
    try {
      await axios.delete(`api/orders/${order.id}`);
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

  // const handleSearchChange = (event) => {
  //   setSearchValue(event.target.value);
  // };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
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

  // const sortedData = orders
  //   .filter(
  //     (row) => row.invoiceNumber.toString().toLowerCase().includes(searchValue.toLowerCase())
  //       || row.name.toLowerCase().includes(searchValue.toLowerCase()),
  //   )
  //   .sort((a, b) => {
  //     if (sortConfig.key !== null) {
  //       if (a[sortConfig.key] < b[sortConfig.key]) {
  //         return sortConfig.direction === 'ascending' ? -1 : 1;
  //       }
  //       if (a[sortConfig.key] > b[sortConfig.key]) {
  //         return sortConfig.direction === 'ascending' ? 1 : -1;
  //       }
  //     }
  //     return 0;
  //   });

  // const sortedData = useMemo(() => {
  //   const startIndex = page * rowsPerPage;
  //   const endIndex = startIndex + rowsPerPage;
  //   return orders
  //     .filter(
  //       (row) => row.invoiceNumber.toString().toLowerCase().includes(searchValue.toLowerCase())
  //           || row.name.toLowerCase().includes(searchValue.toLowerCase())
  //           || row.phone.toString().toLowerCase().includes(searchValue.toLowerCase()),
  //     )
  //     .sort((a, b) => {
  //       if (sortConfig.key !== null) {
  //         if (a[sortConfig.key] < b[sortConfig.key]) {
  //           return sortConfig.direction === 'ascending' ? -1 : 1;
  //         }
  //         if (a[sortConfig.key] > b[sortConfig.key]) {
  //           return sortConfig.direction === 'ascending' ? 1 : -1;
  //         }
  //       }
  //       return 0;
  //     })
  //     .slice(startIndex, endIndex);
  // }, [orders, searchValue, sortConfig, page, rowsPerPage]);

  // const sortedData = useMemo(() => {
  //   const startIndex = page * rowsPerPage;
  //   const endIndex = startIndex + rowsPerPage;
  //   const searchValueWithoutHyphens = searchValue.replace(/-/g, '');
  //   return orders
  //     .filter(
  //       (row) => {
  //         // Remove hyphens from the phone number for search comparison
  //         const phoneNumberWithoutHyphens = row.phone.replace(/-/g, '');
  //         return row.invoiceNumber.toString().toLowerCase().includes(
  //           searchValueWithoutHyphens.toLowerCase(),
  //         ) || row.name.toLowerCase().includes(searchValueWithoutHyphens.toLowerCase())
  //           || phoneNumberWithoutHyphens.toLowerCase().includes(
  //             searchValueWithoutHyphens.toLowerCase(),
  //           );
  //       },
  //     )
  //     .sort((a, b) => {
  //       if (sortConfig.key !== null) {
  //         if (a[sortConfig.key] < b[sortConfig.key]) {
  //           return sortConfig.direction === 'ascending' ? -1 : 1;
  //         }
  //         if (a[sortConfig.key] > b[sortConfig.key]) {
  //           return sortConfig.direction === 'ascending' ? 1 : -1;
  //         }
  //       }
  //       return 0;
  //     })
  //     .slice(startIndex, endIndex);
  // }, [orders, searchValue, sortConfig, page, rowsPerPage]);

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchValue(value);
    setPickUpDateTimeFilter(value); // Update pickUpDateTimeFilter with the search value
  };

  const sortedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const searchValueWithoutHyphens = searchValue.replace(/-/g, ''); // Remove hyphens from the search value
    return orders
      .filter(
        (row) => {
          // Filter by invoiceNumber, name, phone, and pickUpDateTime
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
        // Sort by the selected key and direction
        if (sortConfig.key !== null) {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
        }
        return 0;
      })
      .slice(startIndex, endIndex);
  }, [orders, searchValue, pickUpDateTimeFilter, sortConfig, page, rowsPerPage]);

  return (

    <Box>
      <TextField
        label="Search"
        variant="outlined"
        value={searchValue}
        onChange={handleSearchChange}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <Typography component="div">
                  Invoice Number
                  <IconButton type="button" onClick={() => handleSort('invoiceNumber')} size="small">
                    {sortConfig.key !== 'invoiceNumber' && <SortRounded />}
                    {sortConfig.key === 'invoiceNumber' && (
                      <span>
                        {sortConfig.direction === 'ascending' ? <ArrowUpward /> : <ArrowDownward />}
                      </span>
                    )}
                  </IconButton>
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography component="div">
                  Customer Name
                  <IconButton type="button" onClick={() => handleSort('name')} size="small">
                    {sortConfig.key !== 'name' && <SortRounded />}
                    {sortConfig.key === 'name' && (
                      <span>
                        {sortConfig.direction === 'ascending' ? <ArrowUpward /> : <ArrowDownward />}
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
                    {sortConfig.key !== 'orderTimeLog' && <SortRounded />}
                    {sortConfig.key === 'orderTimeLog' && (
                      <span>
                        {sortConfig.direction === 'ascending' ? <ArrowUpward /> : <ArrowDownward />}
                      </span>
                    )}
                  </IconButton>
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography component="div">
                  Pickup Date/Time
                  <IconButton type="button" onClick={() => handleSort('pickUpDateTime')} size="small">
                    {sortConfig.key !== 'pickUpDateTime' && <SortRounded />}
                    {sortConfig.key === 'pickUpDateTime' && (
                      <span>
                        {sortConfig.direction === 'ascending' ? <ArrowUpward /> : <ArrowDownward />}
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
                  <TableCell>{row.invoiceNumber}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>
                    {new Intl.DateTimeFormat('en-US', {
                      weekday: 'short',
                      year: '2-digit',
                      month: 'numeric',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    }).format(new Date(row.orderTimeLog))}
                  </TableCell>
                  <TableCell>
                    {new Intl.DateTimeFormat('en-US', {
                      weekday: 'short',
                      year: '2-digit',
                      month: 'numeric',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    }).format(new Date(row.pickUpDateTime))}
                  </TableCell>

                  <TableCell><CountdownTimer targetDateTime={row.pickUpDateTime} /></TableCell>
                  <TableCell>
                    <IconButton>
                      <CheckCircleRounded onClick={(e) => { e.stopPropagation(); }} />
                    </IconButton>
                    <IconButton onClick={(e) => { e.stopPropagation(); deleteOrder(row); }}>
                      <DeleteRounded />
                    </IconButton>
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
    </Box>

  );
}

export default CurrentOrderTable;
