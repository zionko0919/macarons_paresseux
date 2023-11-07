/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { useState } from 'react';
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
import ItemType from '../types/item';
import PackOrderModalPageThree from './PackOrderModalPageThree';
import './PackOrderModalPageTwo.css';

function PackOrderModalPageTwo({
  isModalTwoOpen, handleModalTwoClose, handleModalOneClose, addToCart, packItems, packTitle,
}) {
  const closeAllModals = () => {
    handleModalOneClose();
    handleModalTwoClose();
  };

  const [isModalThreeOpen, setIsModalThreeOpen] = useState(false);

  const handleModalThreeOpen = () => {
    setIsModalThreeOpen(true);
    console.log('Opening Pack Order Modal Page 3');
  };

  const handleModalThreeClose = () => {
    setIsModalThreeOpen(false);
    console.log('Going back to Pack Order Modal Page 2');
  };

  const [giftMessage, setGiftMessage] = useState('');
  const [giftFromName, setGiftFromName] = useState('');

  const handleGiftMessageInput = (e) => {
    setGiftMessage(e.target.value);
  };
  const handleGiftFromNameInput = (e) => {
    setGiftFromName(e.target.value);
  };

  const testSubmit = () => {
    handleModalThreeOpen();
    console.log('message: ', giftMessage.toUpperCase());
    console.log('from', giftFromName.toUpperCase());
  };

  return (
    <>
      <Dialog className="pack-order-modal-page-two-dialog" open={isModalTwoOpen} onClose={handleModalTwoClose}>
        <Button type="button" onClick={closeAllModals}>Close X</Button>
        <DialogTitle className="pack-order-modal-page-two-dialog-title">
          Gift Option (#Testing)
        </DialogTitle>
        <DialogContent className="pack-order-modal-page-two-dialog-content" dividers>
          <Box
            component="form"
            sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
            noValidate
            autoComplete="off"
          >
            <DialogContentText className="pack-order-modal-page-two-dialog-content-text">
              Gift wrap comes with your personal message inside a special box.
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
              <Button variant="contained" type="button" onClick={testSubmit}>Submit</Button>
            </FormControl>
          </Box>
        </DialogContent>
        <Button type="button" onClick={handleModalThreeOpen}>Skip</Button>
        <Button type="button" onClick={handleModalTwoClose}>Go Back</Button>
      </Dialog>
      <PackOrderModalPageThree
        isModalThreeOpen={isModalThreeOpen}
        handleModalOneClose={handleModalOneClose}
        handleModalTwoClose={handleModalTwoClose}
        handleModalThreeClose={handleModalThreeClose}
        packItems={packItems}
        packTitle={packTitle}
        addToCart={addToCart}
      />
    </>
  );
}

PackOrderModalPageTwo.propTypes = {
  isModalTwoOpen: PropTypes.bool.isRequired,
  handleModalTwoClose: PropTypes.func.isRequired,
  handleModalOneClose: PropTypes.func.isRequired,
  addToCart: PropTypes.func.isRequired,
  packItems: PropTypes.arrayOf(ItemType).isRequired,
  packTitle: PropTypes.string.isRequired,
};

export default PackOrderModalPageTwo;
