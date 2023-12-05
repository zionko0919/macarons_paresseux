/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import OrderContext from '../context/OrderContext';
import { CartTypes } from '../reducers/cartReducer';
import CartItemViewMoreModal from './CartItemViewMoreModal';

function CartRow({
  cartItem, dispatch,
}) {
  const {
    macItems, drinkItems, packItems, macList, macListDispatch,
  } = useContext(OrderContext);
  let item = '';
  if (cartItem.category === 'drink') {
    item = drinkItems.find((i) => i.itemId === cartItem.itemId);
  } else if (cartItem.category === 'macaron') {
    item = macItems.find((i) => i.itemId === cartItem.itemId);
  } else if (cartItem.category === 'pack') {
    item = packItems.find((i) => i.itemId === cartItem.itemId);
    // item.key = Date.now();
  }
  const removeItemFromCart = () => {
    dispatch({ type: CartTypes.REMOVE, itemId: item.itemId });
  };

  const [isViewMoreModalOpen, setIsViewMoreModalOpen] = useState(false);
  const handleViewMoreModalOpen = () => {
    setIsViewMoreModalOpen(true);
  };
  const handleViewMoreModalClose = () => {
    setIsViewMoreModalOpen(false);
  };

  // console.log(cartItem.subItem);
  // console.log(cartItem.giftOption);
  return (
    <tr>
      <td>{cartItem.quantity}</td>
      <td>{item.title}</td>
      <td>
        $
        {((item.salePrice ?? item.price) * cartItem.quantity).toFixed(2)}
      </td>
      {cartItem.category === 'pack' ? (
        <td>
          <button type="button" onClick={handleViewMoreModalOpen}>...</button>
          <CartItemViewMoreModal
            subItem={cartItem.subItem}
            open={isViewMoreModalOpen}
            onClose={handleViewMoreModalClose}
            giftOption={cartItem.giftOption}
          />
        </td>
      ) : <td>N/A</td>}
      <td>
        <button type="button" onClick={removeItemFromCart}>
          x
        </button>
      </td>
    </tr>
  );
}

CartRow.propTypes = {
  cartItem: PropTypes.shape({
    itemId: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    subItem: PropTypes.arrayOf(PropTypes.shape({
      itemId: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
    })),
  }).isRequired,

  dispatch: PropTypes.func.isRequired,
};

export default CartRow;
