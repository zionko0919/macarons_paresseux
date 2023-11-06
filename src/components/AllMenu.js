import PropTypes from 'prop-types';
import { Route, Routes } from 'react-router-dom';
import MacMenu from './MacMenu';
import MenuDetails from './MenuDetails';
import MenuDetailItem from './MenuDetailItem';
import ItemType from '../types/item';
import './AllMenu.css';

function AllMenu({ addToCart, macItems }) {
  return (
    <div className="all-menu-component">
      <h1>Macarons</h1>
      {macItems.length === 0
        ? <h5>Loading...</h5>
        : (
          <Routes>
            <Route path="/" element={<MacMenu macItems={macItems} />} />
            <Route path="/details" element={<MenuDetails macItems={macItems} />}>
              <Route
                path=":id"
                element={<MenuDetailItem macItems={macItems} addToCart={addToCart} />}
              />
              <Route index element={<div>No Item Selected</div>} />
            </Route>
          </Routes>
        )}

    </div>

  );
}

AllMenu.propTypes = {
  addToCart: PropTypes.func.isRequired,
  macItems: PropTypes.arrayOf(ItemType).isRequired,
};

export default AllMenu;
