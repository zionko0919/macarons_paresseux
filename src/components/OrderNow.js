/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { Route, Routes } from 'react-router-dom';
import MacPacks from './MacPacks';
import DrinkMenu from './DrinkMenu';
import ItemType from '../types/item';
import './OrderNow.css';

function OrderNow({
  packItems, drinkItems, macItems, addToCart,
  macList, macListDispatch,
}) {
  return (
    <div className="ordernow-component">
      <h1>Macarons</h1>
      <Routes>
        <Route
          path="/*"
          element={(
            <MacPacks
              packItems={packItems}
              macItems={macItems}
              addToCart={addToCart}
              macList={macList}
              macListDispatch={macListDispatch}
            />
          )}
        />
      </Routes>
      <h1>Drinks</h1>
      <Routes>
        <Route
          path="/"
          element={(
            <DrinkMenu
              drinkItems={drinkItems}
              addToCart={addToCart}
            />
          )}
        />
      </Routes>
    </div>
  );
}

OrderNow.propTypes = {
  packItems: PropTypes.arrayOf(ItemType).isRequired,
  drinkItems: PropTypes.arrayOf(ItemType).isRequired,
  macItems: PropTypes.arrayOf(ItemType).isRequired,
  addToCart: PropTypes.func.isRequired,
  macList: PropTypes.arrayOf(PropTypes.shape({
    itemId: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
  })).isRequired,
  macListDispatch: PropTypes.func.isRequired,
};

export default OrderNow;
