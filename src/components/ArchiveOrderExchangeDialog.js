/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import { useContext } from 'react';
import {
  Dialog, DialogContent, DialogTitle, FormControl, FormLabel, FormControlLabel, Radio, RadioGroup,
  Container, Table, TableRow, TableBody, TableHead, TableCell, Typography, Select, MenuItem,
  FormGroup, Checkbox, Button,
} from '@mui/material';
import OrderContext from '../context/OrderContext';

function ArchiveOrderExchangeDialog({
  rowData, isExchangeDialogOpen, setIsExchangeDialogOpen, itemExchangeStatus,
  exchangeRadioChangeHandler, submitClickHandler,
}) {
  const { packItems, drinkItems } = useContext(OrderContext);

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
              <RadioGroup defaultValue="EXCHANGED" value={itemExchangeStatus} onChange={exchangeRadioChangeHandler}>
                <FormControlLabel value="REFUNDED" control={<Radio />} label="Return" />
                <FormControlLabel value="EXCHANGED" control={<Radio />} label="Exchange" />
              </RadioGroup>
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
                                />
                                {}
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
                      // checked={incorrectOrder}
                      // onChange={handleExchangeReasonCheckBox}
                        name="incorrectOrder"
                      />
                        )}
                    label="incorrect order"
                  />
                  <FormControlLabel
                    control={(
                      <Checkbox
                        size="small"
                      // checked={damagedProduct}
                      // onChange={handleExchangeReasonCheckBox}
                        name="damagedProduct"
                      />
                        )}
                    label="product damaged"
                  />
                  <FormControlLabel
                    control={(
                      <Checkbox
                        size="small"
                      // checked={poorQuality}
                      // onChange={handleExchangeReasonCheckBox}
                        name="poorQuality"
                      />
                        )}
                    label="poor product quality/condition"
                  />
                  <FormControlLabel
                    control={(
                      <Checkbox
                        size="small"
                      // checked={poorService}
                      // onChange={handleExchangeReasonCheckBox}
                        name="poorService"
                      />
                        )}
                    label="poor service"
                  />
                  <FormControlLabel
                    control={(
                      <Checkbox
                        size="small"
                      // checked={otherReason}
                      // onChange={handleExchangeReasonCheckBox}
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
            onClick={() => { setIsExchangeDialogOpen(false); }}
          >
            Cancel
          </Button>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default ArchiveOrderExchangeDialog;
