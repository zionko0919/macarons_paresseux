import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom';
import { itemImages } from '../items';
import ItemType from '../types/item';
import Thumbnail from './Thumbnail';
import './MenuDetails.css';

function MenuDetails({ macItems }) {
  return (
    <div className="menu-details-component">
      <Outlet />
      <div className="menu-details-component-sidebar">
        {macItems.map((item) => (
          <Thumbnail
            key={item.itemId}
            image={itemImages[item.imageId]}
            title={item.title}
            itemId={item.itemId}
          />
        ))}
      </div>
    </div>
  );
}

MenuDetails.propTypes = {
  macItems: PropTypes.arrayOf(ItemType).isRequired,
};

export default MenuDetails;
