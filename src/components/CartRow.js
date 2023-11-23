/* eslint-disable no-unused-vars */
import { useContext } from 'react';
import PropTypes from 'prop-types';
import OrderContext from '../context/OrderContext';
import { CartTypes } from '../reducers/cartReducer';
import CartRowPackOrderHelper from './CartRowPackOrderHelper';

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
        <CartRowPackOrderHelper />
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
};

export default CartRow;
