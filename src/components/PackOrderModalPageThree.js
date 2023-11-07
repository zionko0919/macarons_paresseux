/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogContentText,
} from '@mui/material';
import ItemType from '../types/item';
import './PackOrderModalPageThree.css';

function PackOrderModalPageThree({
  isModalThreeOpen,
  handleModalThreeClose,
  handleModalTwoClose,
  handleModalOneClose,
  addToCart,
  packItems,
  packTitle,
}) {
  const closeAllModals = () => {
    handleModalThreeClose();
    handleModalTwoClose();
    handleModalOneClose();
  };

  const selectedPack = packItems.find((item) => item.title === packTitle);

  const addItemToCart = () => {
    addToCart(selectedPack.itemId, selectedPack.category);
    closeAllModals();
  };

  return (
    <Dialog
      className="pack-order-modal-page-three-dialog"
      open={isModalThreeOpen}
      onClose={handleModalThreeClose}
    >
      <Button type="button" onClick={closeAllModals}>Close X</Button>
      <DialogTitle className="pack-order-modal-page-three-dialog-title">
        Is this correct? (#Testing)
      </DialogTitle>
      <DialogContent className="pack-order-modal-page-three-dialog-content" dividers>
        <DialogContentText className="pack-order-modal-page-three-dialog-content-text">
          (#Should include Pack-Name, list of Macs, GiftOption)
        </DialogContentText>
      </DialogContent>
      <Button type="button" onClick={addItemToCart}>ADD TO CART</Button>
      <Button type="button" onClick={handleModalThreeClose}>Go Back</Button>
    </Dialog>
  );
}

PackOrderModalPageThree.propTypes = {
  isModalThreeOpen: PropTypes.bool.isRequired,
  handleModalOneClose: PropTypes.func.isRequired,
  handleModalTwoClose: PropTypes.func.isRequired,
  handleModalThreeClose: PropTypes.func.isRequired,
  addToCart: PropTypes.func.isRequired,
  packItems: PropTypes.arrayOf(ItemType).isRequired,
  packTitle: PropTypes.string.isRequired,
};

export default PackOrderModalPageThree;
