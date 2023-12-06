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

  console.log(cartItem.key);

  const removeItemFromCart = () => {
    dispatch({ type: CartTypes.REMOVE, itemId: item.itemId, key: cartItem.key });
  };

  const [isViewMoreModalOpen, setIsViewMoreModalOpen] = useState(false);
  const handleViewMoreModalOpen = () => {
    setIsViewMoreModalOpen(true);
  };
  const handleViewMoreModalClose = () => {
    setIsViewMoreModalOpen(false);
  };

  const handleItemPriceWithGiftOption = () => {
    let itemPrice = (item.salPrice ?? item.price);
    if (cartItem.giftOption && cartItem.giftOption.isGiftOptionSelected) {
      itemPrice += 1.5;
    }
    itemPrice *= cartItem.quantity;
    return itemPrice;
  };

  // console.log(cartItem.subItem);
  // console.log(cartItem.giftOption);
  return (
    <tr>
      <td>{cartItem.quantity}</td>
      <td>{item.title}</td>
      <td>
        $
        {handleItemPriceWithGiftOption().toFixed(2)}
      </td>
      <td>
        {!cartItem.giftOption ? 'n/a' : null}
        {cartItem.giftOption && (cartItem.giftOption.isGiftOptionSelected ? 'Yes' : 'No')}
      </td>
      {cartItem.category === 'pack' ? (
        <td>
          <button type="button" onClick={handleViewMoreModalOpen}>...</button>
          <CartItemViewMoreModal
            itemTitle={item.title}
            subItem={cartItem.subItem}
            open={isViewMoreModalOpen}
            onClose={handleViewMoreModalClose}
            giftOption={cartItem.giftOption}
          />
        </td>
      ) : <td>n/a</td>}
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
