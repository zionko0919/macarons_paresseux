/* eslint-disable no-unused-vars */
import axios from 'axios';
import PropTypes from 'prop-types';
/* eslint-disable no-unused-vars */
import {
  useEffect, useState, useContext, useMemo,
} from 'react';
import {
  Box, IconButton, Accordion, AccordionSummary, AccordionDetails, Container,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Delete, ListRounded, ExpandMoreRounded } from '@mui/icons-material';
import { visuallyHidden } from '@mui/utils';
import OrderContext from '../context/OrderContext';
import { useCurrentUserContext } from '../context/CurrentUserContext';

const openUpDetailedInfoBox = () => {

};

const datailedInfoButton = (params) => (
  <IconButton>
    <ListRounded />
  </IconButton>
);

const columns = [
  {
    field: 'moreInfo',
    headerName: 'Details',
    sortable: false,
    filterable: false,
    headerClassName: 'data-table-header',
    renderCell: datailedInfoButton,
  },
  {
    field: 'invoiceNumber',
    headerName: 'Invoice Number',
    width: 130,
    headerClassName: 'data-table-header',
  },
  {
    field: 'name',
    headerName: 'Customer',
    headerClassName: 'data-table-header',
  },
  {
    field: 'phone',
    headerName: 'Phone',
    sortable: false,
    width: 110,
    headerClassName: 'data-table-header',
  },
  {
    field: 'orderTimeLog',
    headerName: 'Order Date/Time',
    width: 170,
    headerClassName: 'data-table-header',
  },
  {
    field: 'pickUpDateTime',
    headerName: 'Pick-up Date/Time',
    width: 220,
    headerClassName: 'data-table-header',
  },
  {
    field: 'total',
    headerName: 'Total',
    headerClassName: 'data-table-header',
  },
];

function OrdersTestTable() {
  const {
    macItems, drinkItems, packItems, optionalItems,
  } = useContext(OrderContext);

  const [orders, setOrders] = useState([]);

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

  return (
    <Container>
      <Box sx={{
        minHeight: 200,
        width: '100%',
        '& .data-table-header': {
          backgroundColor: '#d9d9d9',
        },
      }}
      >
        <DataGrid
          checkboxSelection
          columns={columns}
          rows={orders}
          slots={{ toolbar: GridToolbar }}
          disableColumnMenu
          disableColumnSelector
          disableRowSelectionOnClick
          dis
        />
      </Box>
    </Container>

  );
}

export default OrdersTestTable;
