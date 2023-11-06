/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { Route, Routes } from 'react-router-dom';
import ItemType from '../types/item';
import PackThumbnail from './PackThumbnail';
import { itemImages } from '../items';
import './Menu.css';

function MacPacks({
  packItems, macItems, addToCart,
  macList, macListDispatch,
}) {
  return (
    <Routes>
      <Route
        path="/"
        element={(
          <div className="menu-component">
            {packItems.map((item) => (
              <PackThumbnail
                key={item.itemId}
                image={itemImages[item.imageId]}
                title={item.title}
                price={item.price}
                numMac={item.numMac}
                addToCart={addToCart}
                packItems={packItems}
                macItems={macItems}
                macList={macList}
                macListDispatch={macListDispatch}
              />
            ))}
          </div>
        )}
      />
    </Routes>

  );
}

MacPacks.propTypes = {
  packItems: PropTypes.arrayOf(ItemType).isRequired,
  addToCart: PropTypes.func.isRequired,
  macItems: PropTypes.arrayOf(ItemType).isRequired,
  macList: PropTypes.arrayOf(PropTypes.shape({
    itemId: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
  })).isRequired,
  macListDispatch: PropTypes.func.isRequired,
};

export default MacPacks;
