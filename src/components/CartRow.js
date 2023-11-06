import PropTypes from 'prop-types';
import ItemType from '../types/item';
import { CartTypes } from '../reducers/cartReducer';

function CartRow({
  cartItem, dispatch, macItems, drinkItems, packItems,
}) {
  // console.log('cart Item: ', cartItem);
  let item = '';
  if (cartItem.category === 'drink') {
    item = drinkItems.find((i) => i.itemId === cartItem.itemId);
  } else if (cartItem.category === 'macaron') {
    item = macItems.find((i) => i.itemId === cartItem.itemId);
  } else if (cartItem.category === 'pack') {
    item = packItems.find((i) => i.itemId === cartItem.itemId);
  }
  // console.log('item: ', item);

  // const itemInItemsArr = macItems.find((i) => i.itemId === cartItem.itemId);
  // const item = itemInItemsArr || drinkItems.find((i) => i.itemId === cartItem.itemId);

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
};

export default CartRow;
