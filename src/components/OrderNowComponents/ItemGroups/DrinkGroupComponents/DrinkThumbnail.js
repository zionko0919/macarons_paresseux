/* eslint-disable no-unused-vars */
import { useState } from 'react';
import PropTypes from 'prop-types';
import DrinkOrderModal from './DrinkOrderModal';
import './DrinkThumbnail.css';

function DrinkThumbnail({
  drinkImage, drinkTitle, drinkPrice, drinkDescription, drinkCalories, drinkSize,
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
          <img src={drinkImage} alt={drinkTitle} />
        </button>
        <DrinkOrderModal
          isDrinkModalOpen={isDrinkModalOpen}
          handleDrinkModalClose={handleDrinkModalClose}
          drinkImage={drinkImage}
          drinkTitle={drinkTitle}
          drinkDescription={drinkDescription}
          drinkCalories={drinkCalories}
          drinkSize={drinkSize}
        />
      </div>
      <p>{drinkTitle}</p>
      <p>
        $
        {drinkPrice.toFixed(2)}
      </p>
    </div>
  );
}

DrinkThumbnail.propTypes = {
  drinkImage: PropTypes.string.isRequired,
  drinkTitle: PropTypes.string.isRequired,
  drinkPrice: PropTypes.number.isRequired,
  drinkDescription: PropTypes.string.isRequired,
  drinkCalories: PropTypes.number.isRequired,
  drinkSize: PropTypes.number.isRequired,
};

export default DrinkThumbnail;
