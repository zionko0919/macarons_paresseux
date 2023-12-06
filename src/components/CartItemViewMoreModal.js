/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { useContext } from 'react';
import {
  Button, Dialog, TextField, DialogActions, DialogContent,
  DialogContentText, DialogTitle, Divider,
} from '@mui/material';
import OrderContext from '../context/OrderContext';
import './CartItemViewMoreModal.css';

function CartItemViewMoreModal({
  itemTitle, open, onClose, subItem, giftOption,
}) {
  // console.log('giftOption: ', giftOption);
  const { macItems } = useContext(OrderContext);

  return (
    <Dialog
      className="cart-item-view-more-modal-component"
      open={open}
      onClose={onClose}
    >
      <Button type="button" onClick={onClose}>Close X</Button>
      <Divider />
      <DialogTitle>
        Your
        {' '}
        {itemTitle}
        {' '}
        Information
      </DialogTitle>
      <Divider />
      <table>
        <thead>
          <tr>
            <th>Macaron</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {subItem.map((item) => (
            <tr key={item.itemId}>
              <td>{macItems.find((i) => i.itemId === item.itemId).title}</td>
              <td>{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Divider />
      <DialogContent>
        <DialogContentText>
          Gift Box:
          {' '}
          {giftOption.isGiftOptionSelected
            ? 'Yes'
            : 'No'}
        </DialogContentText>
        {giftOption.isGiftOptionSelected && (
        <>
          <DialogContentText>Message:</DialogContentText>
          <DialogContentText>{giftOption.giftMessage}</DialogContentText>
          <DialogContentText>From:</DialogContentText>
          <DialogContentText>{giftOption.giftSenderName}</DialogContentText>
        </>
        )}
      </DialogContent>

      <Divider />
      <Button type="button">Edit</Button>
    </Dialog>

  );
}

CartItemViewMoreModal.propTypes = {
  itemTitle: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  subItem: PropTypes.arrayOf(PropTypes.shape({
    itemId: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
  })),
};

CartItemViewMoreModal.defaultProps = {
  subItem: [],
};

export default CartItemViewMoreModal;
