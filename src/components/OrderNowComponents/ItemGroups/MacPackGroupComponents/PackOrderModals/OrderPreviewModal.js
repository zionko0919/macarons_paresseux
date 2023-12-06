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

function OrderPreviewModal({
  title, price, onPrevious, clearPreview,
}) {
  const {
    isGiftOptionSelected,
    giftMessage,
    giftSenderName,
    macList,
    packItems,
    addToCart,
  } = useContext(OrderContext);
  const {
    isOrderSummaryModalOpen,
    handleOrderSummaryModalClose,
  } = useContext(PackOrderModalContext);

  const clearPreviewAndCloseModal = () => {
    clearPreview();
    handleOrderSummaryModalClose();
  };

  const selectedPack = packItems.find((item) => item.title === title);

  const addItemToCart = () => {
    addToCart(selectedPack.itemId, selectedPack.category);
    clearPreview();
    handleOrderSummaryModalClose();
  };

  return (
    <Dialog
      className="order-preview-modal-component"
      open={isOrderSummaryModalOpen}
      onClose={handleOrderSummaryModalClose}
    >
      <Button type="button" onClick={clearPreviewAndCloseModal}>Close X</Button>
      <DialogTitle>
        Your
        {' '}
        {title}
        {' '}
        Preview
      </DialogTitle>
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
      <DialogContent>
        <DialogContentText>
          Gift Box:
          {' '}
          {isGiftOptionSelected ? 'Yes' : 'No'}
        </DialogContentText>
        {isGiftOptionSelected ? (
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
      </DialogContent>
      <Divider />
      <DialogContent>
        <table style={{ borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td>Item: </td>
              <td>
                $
                {' '}
                {price.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td>Gift Box:</td>
              <td>{isGiftOptionSelected ? '$ 1.50' : '$ 0.00'}</td>
            </tr>
            <tr style={{ borderTop: '1px solid #ddd' }}>
              <td>Total:</td>
              <td>
                $
                {' '}
                {isGiftOptionSelected ? (price + 1.5).toFixed(2) : price.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </DialogContent>
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
  price: PropTypes.number.isRequired,
  onPrevious: PropTypes.func.isRequired,
  clearPreview: PropTypes.func.isRequired,
};

export default OrderPreviewModal;
