/* eslint-disable no-unused-vars */
import { useContext } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog, DialogContent, DialogContentText, DialogTitle,
} from '@mui/material';
import OrderContext from '../context/OrderContext';
import './DrinkOrderModal.css';

function DrinkOrderModal({
  isDrinkModalOpen, handleDrinkModalClose, drinkImage, drinkTitle,
}) {
  const { drinkItems, addToCart } = useContext(OrderContext);

  const selectedDrink = drinkItems.find((item) => item.title === drinkTitle);
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
  drinkImage: PropTypes.string.isRequired,
  drinkTitle: PropTypes.string.isRequired,
};

export default DrinkOrderModal;
