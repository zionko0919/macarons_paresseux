/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import {
  Dialog, DialogContent, DialogContentText, DialogTitle,
} from '@mui/material';
import './DrinkOrderModal.css';
import ItemType from '../types/item';

function DrinkOrderModal({
  isDrinkModalOpen, handleDrinkModalClose, drinkTitle, drinkImage, addToCart, drinkItems,
}) {
  const selectedDrink = drinkItems.find((item) => item.title === drinkTitle);
  // console.log('SD: ', selectedDrink);
  // console.log('ID Check: ', selectedDrink.category);
  const addItemToCart = () => {
    addToCart(selectedDrink.itemId, selectedDrink.category);
    handleDrinkModalClose();
  };

  return (
    <Dialog open={isDrinkModalOpen} onClose={handleDrinkModalClose}>
      <button type="button" onClick={handleDrinkModalClose}>Close X</button>
      <DialogTitle>
        {drinkTitle}
      </DialogTitle>
      <DialogContent>
        <img src={drinkImage} alt={drinkTitle} />
        <DialogContentText>
          TESTING DRINK MODAL
        </DialogContentText>
      </DialogContent>
      <button type="button" onClick={addItemToCart}>Add To Cart</button>
    </Dialog>
  );
}

DrinkOrderModal.propTypes = {
  isDrinkModalOpen: PropTypes.bool.isRequired,
  handleDrinkModalClose: PropTypes.func.isRequired,
  drinkTitle: PropTypes.string.isRequired,
  drinkImage: PropTypes.string.isRequired,
  addToCart: PropTypes.func.isRequired,
  drinkItems: PropTypes.arrayOf(ItemType).isRequired,
};

export default DrinkOrderModal;
