/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useContext, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import {
  Dialog, DialogContent, DialogTitle, FormControl, FormLabel, FormControlLabel, Radio, RadioGroup,
  Container, Table, TableRow, TableBody, TableHead, TableCell, Typography, Select, MenuItem,
  FormGroup, Checkbox, Button, Box,
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import OrderContext from '../context/OrderContext';

function ArchiveOrderExchangeDialog({
  rowData, isExchangeDialogOpen, setIsExchangeDialogOpen, itemExchangeStatus,
  exchangeRadioChangeHandler,
}) {
  const { packItems, drinkItems } = useContext(OrderContext);

  const [itemStatus, setItemStatus] = useState('EXCHANGED');
  const typeRadioHandler = (e) => {
    e.preventDefault();
    setItemStatus(e.target.value);
    // console.log('TYPE: ', itemStatus);
  };

  const [adjustQuantity, setAdjustQuantity] = useState(0);
  const qtySelectHandler = (e) => {
    e.preventDefault();
    setAdjustQuantity(e.target.value);
  };
  const [itemQuantities, setItemQuantities] = useState({});
  const itemQtySelectHandler = (itemId, qty) => {
    setItemQuantities({
      ...itemQuantities,
      [itemId]: qty,
    });
  };

  const [reasonsForExchange, setReasonsForExchange] = useState({
    incorrectOrder: false,
    damagedProduct: false,
    poorQuality: false,
    poorService: false,
    otherReason: false,
  });
  const {
    incorrectOrder, damagedProduct, poorQuality, poorService, otherReason,
  } = reasonsForExchange;
  const reasonCheckboxHandler = (e) => {
    e.preventDefault();
    setReasonsForExchange({
      ...reasonsForExchange,
      [e.target.name]: e.target.checked,
    });
  };

  const resetAllStates = () => {
    setItemStatus('EXCHANGED');
    setAdjustQuantity(0);
    setReasonsForExchange({
      incorrectOrder: false,
      damagedProduct: false,
      poorQuality: false,
      poorService: false,
      otherReason: false,
    });
  };

  const [archiveOrders, setArchiveOrders] = useState([]);
  const [apiError, setApiError] = useState('');
  const loadUpdatedArchiveOrders = (order) => {
    const ws = new WebSocket(`${(
      window.location.protocol === 'https:' ? 'wss://' : 'ws://'
    )}${window.location.host}/ws-cafe/`);

    ws.onopen = () => {
      // console.log('WebSocket Connected');
      // Send a message to the WebSocket server indicating that an order is updated
      // ws.send(JSON.stringify({ type: 'archiveOrderUpdated', orderId: order.id }));
    };

    ws.onmessage = (message) => {
      // console.log('Archive Order Component:');
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
      ws.close();
      setArchiveOrders([]);
    };
  };

  const submitClickHandler = async () => {
    try {
      const updatedItems = rowData.items.map((item) => {
        const itemId = item.key;
        const selectedQuantity = itemQuantities[itemId] || 0;

        let exchangeTotalNum = item.exchangeTotalNum || 0;
        let refundTotalNum = item.refundTotalNum || 0;
        if (itemStatus === 'EXCHANGED') {
          exchangeTotalNum += selectedQuantity;
        } else if (itemStatus === 'REFUNDED') {
          refundTotalNum += selectedQuantity;
        }

        return {
          ...item,
          isExchangedOrReturned: true,
          exchangeTotalNum,
          refundTotalNum,
        };
      });
      const updatedRowData = {
        ...rowData,
        items: updatedItems,
        anyReturns: true,
        reasonsForExchangeOrReturn: reasonsForExchange,
      };
      await axios.put(`../api/archiveOrders/${rowData.id}`, updatedRowData);
      loadUpdatedArchiveOrders();
      enqueueSnackbar('Exchange: Success', { variant: 'success' });
      resetAllStates();
      setIsExchangeDialogOpen(false);
      // Update the rowData with the modified items array
    } catch (error) {
      resetAllStates();
      setIsExchangeDialogOpen(false);
      console.error(error);
      setApiError(error?.response?.data?.error || 'Unknown Error');
      enqueueSnackbar('Exchange: Fail', { variant: 'error' });
      console.lgeo(apiError);
    }
  };

  return (
    <Dialog
      open={isExchangeDialogOpen}
      onClose={() => setIsExchangeDialogOpen(false)}
    >
      <DialogTitle align="center">
        Exchange Center - Invoice
        {' '}
        {rowData.invoiceNumber}
      </DialogTitle>
      <form>
        <DialogContent>
          <Container>
            <FormControl>
              <FormLabel>Exchange Type:</FormLabel>
              <Container align="center">
                <RadioGroup defaultValue="EXCHANGED" value={itemStatus} onChange={(e) => { typeRadioHandler(e); }}>
                  <FormControlLabel value="REFUNDED" control={<Radio />} label="Return" />
                  <FormControlLabel value="EXCHANGED" control={<Radio />} label="Exchange" />
                </RadioGroup>
              </Container>
            </FormControl>
          </Container>
        </DialogContent>
        <DialogContent dividers>
          <Container>
            <FormControl>
              <FormLabel>Adjustable Items:</FormLabel>
              <Container>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center"><Typography variant="p">Item</Typography></TableCell>
                      <TableCell align="center"><Typography variant="p">Gift</Typography></TableCell>
                      <TableCell align="center"><Typography variant="p">Qty</Typography></TableCell>
                      <TableCell align="center"><Typography variant="p">Price</Typography></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rowData.items.map((item) => {
                      let itemTitle = 'Error';
                      let itemPrice = 0;
                      if (item.category === 'pack') {
                        itemTitle = packItems.find((i) => i.itemId === item.itemId).title;
                        itemPrice = packItems.find((i) => i.itemId === item.itemId).price;
                        if (item.giftOption.isGfitOptionSelected) {
                          itemPrice += 2.00;
                        }
                      } else if (item.category === 'drink') {
                        itemTitle = drinkItems.find((i) => i.itemId === item.itemId).title;
                        itemPrice = drinkItems.find((i) => i.itemId === item.itemId).price;
                      } else {
                        console.error('Cannot retrieve data');
                      }
                      return (
                        <TableRow>
                          <TableCell align="center">
                            <Typography variant="p">{itemTitle}</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="p">
                              {(() => {
                                if (item.giftOption) {
                                  return item.giftOption.isGiftOptionSelected ? 'O' : 'X';
                                }
                                return 'X';
                              })()}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="p">
                              <FormControl size="small">
                                <Select
                                  defaultValue={0}
                                  onChange={(e) => {
                                    itemQtySelectHandler(
                                      item.key,
                                      e.target.value,
                                    );
                                  }}

                                >
                                  {Array.from({ length: item.quantity + 1 }, (_, index) => (
                                    <MenuItem key={index} value={index}>
                                      {index}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="p">
                              $
                              ToDo
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                  <TableBody>
                    <TableRow sx={{ '& td': { border: 0 } }}>
                      <TableCell align="right" colSpan={3}><Typography fontWeight="bold" variant="p">Total Refund: </Typography></TableCell>
                      <TableCell align="center"><Typography fontWeight="bold" variant="p">$ ToDo</Typography></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Container>
            </FormControl>
          </Container>
        </DialogContent>
        <DialogContent>
          <Container>
            <FormControl size="small">
              <FormLabel>Reason Type:</FormLabel>
              <Container>
                <FormGroup>
                  <FormControlLabel
                    control={(
                      <Checkbox
                        size="small"
                        checked={incorrectOrder}
                        onChange={(e) => { reasonCheckboxHandler(e); }}
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
                        onChange={(e) => { reasonCheckboxHandler(e); }}
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
                        onChange={(e) => { reasonCheckboxHandler(e); }}
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
                        onChange={(e) => { reasonCheckboxHandler(e); }}
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
                        onChange={(e) => { reasonCheckboxHandler(e); }}
                        name="otherReason"
                      />
                        )}
                    label="other"
                  />
                </FormGroup>
              </Container>
            </FormControl>
          </Container>
        </DialogContent>
        <DialogContent dividers align="right">
          <Button type="button" variant="text" onClick={submitClickHandler}>#Submit</Button>
          <Button
            type="button"
            variant="text"
            onClick={() => { setIsExchangeDialogOpen(false); resetAllStates(); }}
          >
            Cancel
          </Button>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default ArchiveOrderExchangeDialog;
