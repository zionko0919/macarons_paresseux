/* eslint-disable no-unused-vars */
import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Box,
  Button,
  FormControl,
} from '@mui/material';
import PackOrderModalPageThree from './PackOrderModalPageThree';
import './PackOrderModalPageTwo.css';

function PackOrderModalPageTwo({
  isModalTwoOpen, handleModalOneClose, handlModalOneCloseAfterAddToCart,
  handleModalTwoClose, packTitle,
}) {
  const [isModalThreeOpen, setIsModalThreeOpen] = useState(false);
  const [giftOption, setGiftOption] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  const [giftFromName, setGiftFromName] = useState('');

  const handleModalThreeOpen = () => {
    setIsModalThreeOpen(true);
    // console.log('Opening Pack Order Modal Page 3');
  };

  const handleModalThreeClose = () => {
    setIsModalThreeOpen(false);
    // console.log('Going back to Pack Order Modal Page 2');
  };

  const closeAllModals = () => {
    handleModalOneClose();
    handleModalTwoClose();
    setGiftOption(false);
    setGiftMessage('');
    setGiftFromName('');
  };

  const handleGiftMessageInput = (e) => {
    setGiftMessage(e.target.value.toUpperCase());
  };
  const handleGiftFromNameInput = (e) => {
    setGiftFromName(e.target.value.toUpperCase());
  };

  const skipToModalThree = () => {
    setGiftOption(false);
    setGiftMessage('');
    setGiftFromName('');
    handleModalThreeOpen();
  };

  const addGiftOption = () => {
    setGiftOption(true);
    handleModalThreeOpen();
    console.log('message: ', giftMessage);
    console.log('from', giftFromName);
  };

  return (
    <>
      <Dialog className="pack-order-modal-page-two-dialog" open={isModalTwoOpen} onClose={handleModalTwoClose}>
        <Button type="button" onClick={closeAllModals}>Close X</Button>
        <DialogTitle className="pack-order-modal-page-two-dialog-title">
          Gift Option +$1.00 (#Testing)
        </DialogTitle>
        <DialogContent className="pack-order-modal-page-two-dialog-content" dividers>
          <Box
            component="form"
            sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
            noValidate
            autoComplete="off"
          >
            <DialogContentText className="pack-order-modal-page-two-dialog-content-text">
              Gift option arrives in a special gift box with a personalized message card.
            </DialogContentText>
            <FormControl>
              <TextField
                label="Your Message: "
                multiline
                variant="outlined"
                rows={4}
                inputProps={{ maxLength: 100 }}
                value={giftMessage}
                onChange={handleGiftMessageInput}
              />
              <TextField
                label="From: "
                variant="outlined"
                inputProps={{ maxLength: 30 }}
                value={giftFromName}
                onChange={handleGiftFromNameInput}
              />
              <Button
                variant="contained"
                type="button"
                onClick={addGiftOption}
                disabled={!(giftFromName && giftMessage)}
              >
                Add Gift Option
              </Button>
            </FormControl>
          </Box>
        </DialogContent>
        <Button type="button" onClick={skipToModalThree}>Skip</Button>
        <Button type="button" onClick={handleModalTwoClose}>Go Back</Button>
      </Dialog>
      <PackOrderModalPageThree
        isModalThreeOpen={isModalThreeOpen}
        handleModalOneClose={handleModalOneClose}
        handlModalOneCloseAfterAddToCart={handlModalOneCloseAfterAddToCart}
        handleModalTwoClose={handleModalTwoClose}
        handleModalThreeClose={handleModalThreeClose}
        packTitle={packTitle}
        giftMessage={giftMessage}
        giftFromName={giftFromName}
        giftOption={giftOption}
        setGiftOption={setGiftOption}
        setGiftMessage={setGiftMessage}
        setGiftFromName={setGiftFromName}
      />
    </>
  );
}

PackOrderModalPageTwo.propTypes = {
  isModalTwoOpen: PropTypes.bool.isRequired,
  handleModalOneClose: PropTypes.func.isRequired,
  handlModalOneCloseAfterAddToCart: PropTypes.func.isRequired,
  handleModalTwoClose: PropTypes.func.isRequired,
  packTitle: PropTypes.string.isRequired,
};

export default PackOrderModalPageTwo;
