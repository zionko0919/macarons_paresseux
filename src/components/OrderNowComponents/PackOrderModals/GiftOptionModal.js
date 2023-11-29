/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { useContext } from 'react';
import {
  Box, Button, FormControl, TextField, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, Divider,
} from '@mui/material';
import OrderContext from '../../../context/OrderContext';
import PackOrderModalContext from '../../../context/PackOrderModalContext';

function GiftOptionModal({ onPrevious, onNext }) {
  const {
    isGiftOptionModalOpen,
    handleGiftOptionModalClose,
    closeSecondOpenThird,
  } = useContext(PackOrderModalContext);

  const {
    isGiftOptionSelected,
    setIsGiftOptionSelected,
    giftMessage,
    setGiftMessage,
    giftSenderName,
    setGiftSenderName,
  } = useContext(OrderContext);

  const handleGiftMessageInput = (e) => {
    setGiftMessage(e.target.value.toUpperCase());
  };

  const handleGiftSenderNameInput = (e) => {
    setGiftSenderName(e.target.value.toUpperCase());
  };

  const addGiftOption = () => {
    setIsGiftOptionSelected(true);
    closeSecondOpenThird();
    console.log('message: ', giftMessage);
    console.log('from', giftSenderName);
  };

  const skipGiftOption = () => {
    setIsGiftOptionSelected(false);
    onNext();
  };

  return (
    <Dialog
      className="gift-option-modal-component"
      open={isGiftOptionModalOpen}
      onClose={handleGiftOptionModalClose}
    >
      <Button type="button" onClick={handleGiftOptionModalClose}>Close X</Button>
      <DialogTitle>Gift Option (Testing)</DialogTitle>
      <Divider />
      <DialogContent>
        <DialogContentText>
          Gift option arrives in a special gift box with a personalized message card.
        </DialogContentText>
        <TextField
          label="Your Message: "
          multiline
          variant="outlined"
          rows={8}
          inputProps={{ maxLength: 120 }}
          value={giftMessage}
          onChange={handleGiftMessageInput}
        />
        <TextField
          label="From: "
          multiline
          variant="outlined"
          rows={2}
          inputProps={{ maxLength: 30 }}
          value={giftSenderName}
          onChange={handleGiftSenderNameInput}
        />
        <Button
          variant="contained"
          type="button"
          onClick={addGiftOption}
          disabled={!(giftSenderName && giftMessage)}
        >
          Add Gift Option
        </Button>
      </DialogContent>
      <DialogActions>
        <Button type="button" onClick={onPrevious}>Back</Button>
        <Button type="button" onClick={skipGiftOption}>Skip</Button>
      </DialogActions>
    </Dialog>
  );
}

GiftOptionModal.propTypes = {
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default GiftOptionModal;
