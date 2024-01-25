/* eslint-disable no-unused-vars */
import axios from 'axios';
import PropTypes from 'prop-types';
/* eslint-disable no-unused-vars */
import {
  useEffect, useState, useContext, useMemo,
} from 'react';
import {
  Box, Table, alpha, TableBody, TableCell, TableContainer, TableHead, TablePagination,
  TableRow, TableSortLabel, Toolbar, Typography, Paper, Checkbox, IconButton, Tooltip,
  FormControlLabel, Switch, Accordion, AccordionSummary, AccordionDetails,
} from '@mui/material';
import { Delete, FilterList, ExpandMoreRounded } from '@mui/icons-material';
import { visuallyHidden } from '@mui/utils';
import OrderContext from '../context/OrderContext';
import { useCurrentUserContext } from '../context/CurrentUserContext';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => getComparator(a, b, orderBy)
    : (a, b) => -getComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'invoice_number',
    numeric: true,
    disablePadding: true,
    label: 'Invoice Number',
  },
  {
    id: 'customer_name',
    numeric: false,
    disablePadding: false,
    label: 'Customer Name',
  },
  {
    id: 'phone',
    numeric: true,
    disablePadding: false,
    label: 'Phone Number',
  },
  {
    id: 'billing_zipcode',
    numeric: true,
    disablePadding: false,
    label: 'Billing ZIP code',
  },
  {
    id: 'order_date',
    numeric: false,
    disablePadding: false,
    label: 'Order Date',
  },
  {
    id: 'pickup_date',
    numeric: false,
    disablePadding: false,
    label: 'Pick-Up Date',
  },
  {
    id: 'pickup_time',
    numeric: false,
    disablePadding: false,
    label: 'Pick-Up Time',
  },
  {
    id: 'subtotal',
    numeric: true,
    disablePadding: false,
    label: 'Subtotal',
  },
  {
    id: 'discount',
    numeric: true,
    disablePadding: false,
    label: 'Discount',
  },
  {
    id: 'total_without_tax',
    numeric: true,
    disablePadding: false,
    label: 'Discounted Total',
  },
  {
    id: 'sales_tax',
    numeric: true,
    disablePadding: false,
    label: 'Sales Tax',
  },
  {
    id: 'total_all',
    numeric: true,
    disablePadding: false,
    label: 'Total',
  },
  {
    id: 'more_info',
    numeric: false,
    disablePadding: false,
    label: 'More Info',
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) => alpha(
            theme.palette.primary.main,
            theme.palette.action.activatedOpacity,
          ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected}
          {' '}
          selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Current Orders
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <Delete />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterList />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

// My Component ******************************************************************************

function CurrentOrderTable() {
  const {
    macItems, drinkItems, packItems, optionalItems,
  } = useContext(OrderContext);

  const [orders, setOrders] = useState([]);
  const [orderEntry, setOrderEntry] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { currentUser } = useCurrentUserContext();

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

  const deleteOrder = async (order) => {
    try {
      await axios.delete(`api/orders/${order.id}`);
      loadOrders();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && orderEntry === 'asc';
    setOrderEntry(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = orders.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - orders.length) : 0;

  const visibleRows = useMemo(
    () => stableSort(orders, getComparator(orderEntry, orderBy)).slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage,
    ),
    [orders, orderEntry, orderBy, page, rowsPerPage],
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={orderEntry}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={orders.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >

                    {/* <Accordion>
                      <AccordionSummary> */}

                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.invoiceNum}
                    </TableCell>
                    <TableCell align="right">{row.name}</TableCell>
                    <TableCell align="right">{row.phone}</TableCell>
                    <TableCell align="right">{row.zipCode}</TableCell>
                    <TableCell align="right">{row.orderTimeLog}</TableCell>
                    <TableCell align="right">{row.pickUpDateString}</TableCell>
                    <TableCell align="right">{row.pickUpTime}</TableCell>
                    <TableCell align="right">
                      $
                      {row.subTotal.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      - $
                      {row.couponDiscountPrice.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      $
                      {row.discountedSubTotal.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      $
                      {row.taxAmount.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      $
                      {row.total.toFixed(2)}
                    </TableCell>
                    {/* Button to Show Dialog? */}
                    <TableCell align="right">
                      <IconButton>
                        <ExpandMoreRounded />
                      </IconButton>
                    </TableCell>

                    {/* </AccordionSummary>
                      <AccordionDetails>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                        malesuada lacus ex, sit amet blandit leo lobortis eget.
                      </AccordionDetails>
                    </Accordion> */}

                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
              <TableRow
                style={{
                  height: (dense ? 33 : 53) * emptyRows,
                }}
              >
                <TableCell colSpan={6} />
              </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={orders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  );
}

export default CurrentOrderTable;
