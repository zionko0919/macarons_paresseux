import { memo, useContext } from 'react';
import PropTypes from 'prop-types';
import { useParams, Link } from 'react-router-dom';
import OrderContext from '../../context/OrderContext';
import { itemImages } from '../../items';
import './MenuDetailItem.css';

function MenuDetailItem({ id }) {
  const { addToCart, macItems } = useContext(OrderContext);

  const menuDetailItem = macItems.find((item) => item.itemId === id);
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
  id: PropTypes.string.isRequired,
};

const MenuDetailItemMemo = memo(MenuDetailItem);

function MenuDetailsOuter() {
  const { addToCart, macItems } = useContext(OrderContext);

  const { id } = useParams();
  return (
    <MenuDetailItemMemo
      addToCart={addToCart}
      id={id}
      macItems={macItems}
    />
  );
}

export default MenuDetailsOuter;
