import PropTypes from 'prop-types';
import ItemType from '../types/item';
import Thumbnail from './Thumbnail';
import { itemImages } from '../items';
import './Menu.css';

function MacMenu({ macItems }) {
  return (
    <div className="menu-component">
      {macItems.map((item) => (
        <Thumbnail
          key={item.itemId}
          itemId={item.itemId}
          image={itemImages[item.imageId]}
          title={item.title}
        />
      ))}
    </div>
  );
}

MacMenu.propTypes = {
  macItems: PropTypes.arrayOf(ItemType).isRequired,
};

export default MacMenu;
