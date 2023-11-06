/* eslint-disable no-unused-vars */
import {
  Dialog,
  DialogContent, DialogContentText,
  DialogTitle,
} from '@mui/material';
import PropTypes from 'prop-types';
import './PackOrderModalPageTwo.css';
import ItemType from '../types/item';

function PackOrderModalPageTwo({
  isModalTwoOpen, handleModalTwoClose, handleModalOneClose, addToCart, packItems, packTitle,
}) {
  const closeAllModals = () => {
    handleModalOneClose();
    handleModalTwoClose();
    console.log('Closing All Modals for Pack Orders');
  };

  // console.log('pack items: ', packItems);
  // console.log('pack title: ', packTitle);
  const selectedPack = packItems.find((item) => item.title === packTitle);
  // console.log('selected pack: ', selectedPack);
  const addItemToCart = () => {
    addToCart(selectedPack.itemId, selectedPack.category);
    closeAllModals();
  };

  return (
    <Dialog className="pack-order-modal-page-two-dialog" open={isModalTwoOpen} onClose={handleModalTwoClose}>
      <button type="button" onClick={closeAllModals}>Close X</button>
      <DialogTitle className="pack-order-modal-page-two-dialog-title">
        Gift Wrap Option
      </DialogTitle>
      <DialogContent className="pack-order-modal-page-two-dialog-content" dividers>
        <DialogContentText className="pack-order-modal-page-two-dialog-content-text">
          Testing Out the Content Box
        </DialogContentText>
      </DialogContent>
      <button type="button" onClick={addItemToCart}>Add To Cart</button>
      <button type="button" onClick={handleModalTwoClose}>Go Back</button>
    </Dialog>
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
