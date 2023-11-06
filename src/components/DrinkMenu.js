import PropTypes from 'prop-types';
import ItemType from '../types/item';
import DrinkThumbnail from './DrinkThumbnail';
import { itemImages } from '../items';
import './Menu.css';

function DrinkMenu({ drinkItems, addToCart }) {
  return (
    <div className="menu-component">
      {drinkItems.map((item) => (
        <DrinkThumbnail
          key={item.itemId}
          image={itemImages[item.imageId]}
          title={item.title}
          price={item.price}
          drinkItems={drinkItems}
          addToCart={addToCart}
        />
      ))}
    </div>
  );
}

DrinkMenu.propTypes = {
  drinkItems: PropTypes.arrayOf(ItemType).isRequired,
  addToCart: PropTypes.func.isRequired,
};

export default DrinkMenu;
