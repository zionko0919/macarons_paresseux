/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { useContext } from 'react';
import {
  Box, Button, FormControl, TextField, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, Divider,
} from '@mui/material';
import OrderContext from '../../../../../context/OrderContext';
import PackOrderModalContext from '../../../../../context/PackOrderModalContext';

function GiftOptionModal({ onPrevious, onNext, clearPreview }) {
  const {
    isGiftOptionSelected,
    setIsGiftOptionSelected,
    giftMessage,
    setGiftMessage,
    giftSenderName,
    setGiftSenderName,
  } = useContext(OrderContext);
  const {
    isGiftOptionModalOpen,
    handleGiftOptionModalClose,
    closeSecondOpenThird,
  } = useContext(PackOrderModalContext);

  const handleGiftMessageInput = (e) => {
    setGiftMessage(e.target.value);
  };

  const handleGiftSenderNameInput = (e) => {
    setGiftSenderName(e.target.value);
  };

  const addGiftOption = () => {
    setIsGiftOptionSelected(true);
    closeSecondOpenThird();
  };

  const skipGiftOption = () => {
    setIsGiftOptionSelected(false);
    onNext();
  };

  const clearPreviewAndCloseModal = () => {
    clearPreview();
    handleGiftOptionModalClose();
  };

  return (
    <Dialog
      className="gift-option-modal-component"
      open={isGiftOptionModalOpen}
      onClose={handleGiftOptionModalClose}
    >
      <Button type="button" onClick={clearPreviewAndCloseModal}>Close X</Button>
      <DialogTitle>Gift Box Option ($1.50)</DialogTitle>
      <Divider />
      <DialogContent>
        <DialogContentText>
          Adds a special gift box with your personalized message card.
        </DialogContentText>
        <TextField
          label="Your Message: "
          multiline
          variant="outlined"
          rows={8}
          inputProps={{ maxLength: 280 }}
          helperText={`${giftMessage.length}/${280}`}
          value={giftMessage}
          onChange={handleGiftMessageInput}
        />
        <TextField
          label="From: "
          multiline
          variant="outlined"
          rows={2}
          inputProps={{ maxLength: 30 }}
          helperText={`${giftSenderName.length}/${30}`}
          value={giftSenderName}
          onChange={handleGiftSenderNameInput}
        />
        <Button
          variant="contained"
          type="button"
          onClick={addGiftOption}
          disabled={!(giftSenderName && giftMessage)}
        >
          Add Gift Box
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
  clearPreview: PropTypes.func.isRequired,
};

export default GiftOptionModal;
