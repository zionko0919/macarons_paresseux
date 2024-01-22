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
} from '@mui/material';
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
    }, 500000); // Polling interval in milliseconds (e.g., 5000ms = 5 seconds)

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

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

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

  const sortedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return orders
      .filter(
        (row) => row.invoiceNumber.toString().toLowerCase().includes(searchValue.toLowerCase())
            || row.name.toLowerCase().includes(searchValue.toLowerCase()),
      )
      .sort((a, b) => {
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
  }, [orders, searchValue, sortConfig, page, rowsPerPage]);

  return (
    <Container>
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
                <TableCell />
                <TableCell>
                  <div>
                    Invoice Number
                    <button type="button" onClick={() => handleSort('invoiceNumber')}>
                      {sortConfig.key === 'invoiceNumber' && (
                      <span>
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                      )}
                    </button>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    Customer Name
                    <button type="button" onClick={() => handleSort('name')}>
                      {sortConfig.key === 'name' && (
                      <span>
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                      )}
                    </button>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    Order Date/Time
                    <button type="button" onClick={() => handleSort('orderTimeLog')}>
                      {sortConfig.key === 'orderTimeLog' && (
                      <span>
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                      )}
                    </button>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    Pickup Date/Time
                    <button type="button" onClick={() => handleSort('pickUpDateTime')}>
                      {sortConfig.key === 'pickUpDateTime' && (
                      <span>
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                      )}
                    </button>
                  </div>
                </TableCell>
                <TableCell>To Do</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData.map((row) => (
                <Fragment key={row.invoiceNumber}>
                  <TableRow onClick={() => handleRowClick(row)}>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>{row.invoiceNumber}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.orderTimeLog}</TableCell>
                    <TableCell>{row.pickUpDateTime}</TableCell>
                    <TableCell><CountdownTimer targetDateTime={row.pickUpDateTime} /></TableCell>
                    <TableCell>
                      <Button onClick={() => deleteOrder(row)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                      <Collapse in={expandedRow === row} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                          <Typography variant="h6" gutterBottom component="div">
                            Information
                          </Typography>
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
    </Container>
  );
}

export default CurrentOrderTable;
