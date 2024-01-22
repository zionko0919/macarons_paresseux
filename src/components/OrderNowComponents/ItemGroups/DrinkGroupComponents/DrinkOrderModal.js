/* eslint-disable no-unused-vars */
import { useContext } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Paper, Container, Box, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, Divider,
} from '@mui/material';
import OrderContext from '../../../../context/OrderContext';
import './DrinkOrderModal.css';

function DrinkOrderModal({
  isDrinkModalOpen, handleDrinkModalClose, drinkImage,
  drinkTitle, drinkDescription, drinkCalories, drinkSize,
}) {
  const { drinkItems, addToCart } = useContext(OrderContext);

  const selectedDrink = drinkItems.find((item) => item.title === drinkTitle);
  const addItemToCart = () => {
    addToCart(selectedDrink.itemId, selectedDrink.category);
    handleDrinkModalClose();
  };

  return (
    <Dialog open={isDrinkModalOpen} onClose={handleDrinkModalClose}>
      <Button type="button" onClick={handleDrinkModalClose}>Close X</Button>
      <Divider />
      <img src={drinkImage} alt={drinkTitle} align="center" />
      <DialogContent>
        <DialogTitle align="center">
          {drinkTitle}
        </DialogTitle>
        <DialogContentText>
          {drinkDescription}
        </DialogContentText>
        <DialogContentText>
          Calories:
          {' '}
          {drinkCalories}
        </DialogContentText>
        <DialogContentText>
          Size:
          {' '}
          {drinkSize}
          {' '}
          fl oz
        </DialogContentText>
      </DialogContent>
      <Divider />
      <Button type="button" onClick={addItemToCart}>Add To Cart</Button>
    </Dialog>
  );
}

DrinkOrderModal.propTypes = {
  isDrinkModalOpen: PropTypes.bool.isRequired,
  handleDrinkModalClose: PropTypes.func.isRequired,
  drinkImage: PropTypes.string.isRequired,
  drinkTitle: PropTypes.string.isRequired,
  drinkDescription: PropTypes.string.isRequired,
  drinkCalories: PropTypes.number.isRequired,
  drinkSize: PropTypes.number.isRequired,
};

export default DrinkOrderModal;
