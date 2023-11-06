/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { useState } from 'react';
import DrinkOrderModal from './DrinkOrderModal';
import './DrinkThumbnail.css';
import ItemType from '../types/item';

function DrinkThumbnail({
  image, title, price, drinkItems, addToCart,
}) {
  const [isDrinkModalOpen, setIsDrinkModalOpen] = useState(false);

  const handleDrinkModalOpen = () => {
    setIsDrinkModalOpen(true);
  };

  const handleDrinkModalClose = () => {
    setIsDrinkModalOpen(false);
  };

  return (
    <div className="drink-thumbnail-component">
      <div className="drink-thumbnail-popup-component">
        <button
          className="drink-thumbnail-button"
          type="button"
          onClick={handleDrinkModalOpen}
        >
          <img src={image} alt={title} />
        </button>
        <DrinkOrderModal
          isDrinkModalOpen={isDrinkModalOpen}
          handleDrinkModalClose={handleDrinkModalClose}
          drinkTitle={title}
          drinkImage={image}
          addToCart={addToCart}
          drinkItems={drinkItems}
        />
      </div>
      <p>{title}</p>
      <p>
        $
        {price.toFixed(2)}
      </p>
    </div>
  );
}

DrinkThumbnail.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  drinkItems: PropTypes.arrayOf(ItemType).isRequired,
  addToCart: PropTypes.func.isRequired,
};

export default DrinkThumbnail;
