/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { useContext } from 'react';
import {
  Box, Button, TextField, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, Divider,
} from '@mui/material';
import OrderContext from '../../../../../context/OrderContext';
import PackOrderModalContext from '../../../../../context/PackOrderModalContext';
import OrderPreviewModalHelper from './OrderPreviewModalHelper';
import './OrderPreviewModal.css';

function OrderPreviewModal({ title, onPrevious }) {
  const {
    isGiftOptionSelected, giftMessage, giftSenderName, macList, packItems, addToCart,
  } = useContext(OrderContext);

  const {
    isOrderSummaryModalOpen,
    handleOrderSummaryModalClose,
  } = useContext(PackOrderModalContext);

  const selectedPack = packItems.find((item) => item.title === title);

  const addItemToCart = () => {
    addToCart(selectedPack.itemId, selectedPack.category);
    handleOrderSummaryModalClose();
  };

  return (
    <Dialog
      className="order-Preview-modal-component"
      open={isOrderSummaryModalOpen}
      onClose={handleOrderSummaryModalClose}
    >
      <Button type="button" onClick={handleOrderSummaryModalClose}>Close X</Button>
      <DialogTitle>Your Box Preview</DialogTitle>
      <DialogContent>Is this Correct?</DialogContent>
      <Divider />
      <table>
        <thead>
          <tr>
            <th>Macaron</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {macList.map((item) => (
            <OrderPreviewModalHelper
              key={item.itemId}
              macListItem={item}
            />
          ))}
        </tbody>
      </table>
      <Divider />
      <DialogContentText>
        Gift Wrap:
        {' '}
        {isGiftOptionSelected === true ? 'Yes' : 'No'}
      </DialogContentText>
      { isGiftOptionSelected ? (
        <>
          <DialogContentText>
            Message:
            {' '}
            {giftMessage}
          </DialogContentText>
          <DialogContentText>
            From:
            {' '}
            {giftSenderName}
          </DialogContentText>
        </>
      ) : ''}
      <Divider />
      <DialogActions>
        <Button type="button" onClick={onPrevious}>Back</Button>
        <Button type="button" variant="contained" onClick={addItemToCart}>Add To Cart</Button>
      </DialogActions>
    </Dialog>
  );
}

OrderPreviewModal.propTypes = {
  title: PropTypes.string.isRequired,
  onPrevious: PropTypes.func.isRequired,
};

export default OrderPreviewModal;
