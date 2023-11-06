import PropTypes from 'prop-types';
import { useParams, Link } from 'react-router-dom';
import { itemImages } from '../items';
import ItemType from '../types/item';
import './MenuDetailItem.css';

function MenuDetailItem({ addToCart, macItems }) {
  console.log('atc: ', typeof addToCart);
  const { id } = useParams();
  const menuDetailItem = macItems.find((item) => item.itemId === id);
  console.log('MDI', menuDetailItem);
  const addItemToCart = () => {
    addToCart(menuDetailItem.itemId, menuDetailItem.category);
  };

  return (
    <div className="menu-detail-item-component">
      {menuDetailItem ? (
        <>
          <img
            className="menu-details-image"
            src={itemImages[menuDetailItem.imageId]}
            alt={menuDetailItem.title}
          />
          <h2>{menuDetailItem.title}</h2>
          {menuDetailItem.calories && (
          <h6>
            {menuDetailItem.calories}
            &nbsp;cal
          </h6>
          )}
          {menuDetailItem.description && <h6>{menuDetailItem.description}</h6>}
          <div>
            $
            {(menuDetailItem.salePrice ?? menuDetailItem.price).toFixed(2)}
            &nbsp;ea.
          </div>
          <button
            type="button"
            onClick={addItemToCart}
          >
            Add to Cart
          </button>
          <Link to="/OrderNow">
            <button type="button">Order Now</button>
          </Link>
        </>
      ) : <h4>Unknown Item</h4>}
    </div>
  );
}

MenuDetailItem.propTypes = {
  addToCart: PropTypes.func.isRequired,
  macItems: PropTypes.arrayOf(ItemType).isRequired,
};

export default MenuDetailItem;
