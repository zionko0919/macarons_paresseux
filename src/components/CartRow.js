/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import ItemType from '../types/item';
import { CartTypes } from '../reducers/cartReducer';
import CartRowPackOrderHelper from './CartRowPackOrderHelper';

function CartRow({
  cartItem, dispatch, macItems, drinkItems, packItems, macList, macListDispatch,
}) {
  // console.log('cart Item: ', cartItem);
  // console.log('macList:', macList);
  let item = '';
  if (cartItem.category === 'drink') {
    item = drinkItems.find((i) => i.itemId === cartItem.itemId);
  } else if (cartItem.category === 'macaron') {
    item = macItems.find((i) => i.itemId === cartItem.itemId);
  } else if (cartItem.category === 'pack') {
    item = packItems.find((i) => i.itemId === cartItem.itemId);
  }

  const removeItemFromCart = () => {
    dispatch({ type: CartTypes.REMOVE, itemId: item.itemId });
  };

  return (
    <tr>
      <td>{cartItem.quantity}</td>
      <td>{item.title}</td>
      <td>
        $
        {((item.salePrice ?? item.price) * cartItem.quantity).toFixed(2)}
      </td>
      <td>
        <button type="button" onClick={removeItemFromCart}>
          x
        </button>
      </td>
      <td>
        <CartRowPackOrderHelper macList={macList} macItems={macItems} />
      </td>
    </tr>
  );
}

CartRow.propTypes = {
  cartItem: PropTypes.shape({
    itemId: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
  macItems: PropTypes.arrayOf(ItemType).isRequired,
  drinkItems: PropTypes.arrayOf(ItemType).isRequired,
  packItems: PropTypes.arrayOf(ItemType).isRequired,
  macList: PropTypes.arrayOf(PropTypes.shape({
    itemId: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
  })).isRequired,
  macListDispatch: PropTypes.func.isRequired,
};

export default CartRow;
