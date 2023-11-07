/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import ItemType from '../types/item';
import CartRow from './CartRow';
import './Cart.css';

function Cart({
  cart, dispatch, macItems, drinkItems, packItems, optionalItems, macList, macListDispatch,
}) {
  // console.log('cart: ', cart);
  const subTotal = cart.reduce((acc, item) => {
    // console.log('curItem: ', item);
    // console.log('curItem Category: ', item.category);
    let detailItem = '';
    if (item.category === 'macaron') {
      detailItem = macItems.find((i) => i.itemId === item.itemId);
    } else if (item.category === 'drink') {
      detailItem = drinkItems.find((i) => i.itemId === item.itemId);
    } else if (item.category === 'pack') {
      detailItem = packItems.find((i) => i.itemId === item.itemId);
    }
    // console.log('TDI: ', detailItem);

    // const foundInItemsArr = macItems.find((i) => i.itemId === item.itemId);
    // const detailItem = foundInItemsArr || drinkItems.find((i) => i.itemId === item.itemId);
    // console.log('detailItem: ', detailItem);
    const itemPrice = detailItem.salePrice ?? detailItem.price;
    // console.log('item price: ', itemPrice);
    return item.quantity * itemPrice + acc;
  }, 0);

  return (
    <div className="cart-component">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <div>Your cart is empty.</div>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Quantity</th>
                <th>Item</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <CartRow
                  key={item.itemId}
                  cartItem={item}
                  macItems={macItems}
                  drinkItems={drinkItems}
                  packItems={packItems}
                  dispatch={dispatch}
                  macList={macList}
                  macListDispatch={macListDispatch}
                />
              ))}
            </tbody>
          </table>
          <div>
            Subtotal: $
            {subTotal.toFixed(2)}
          </div>
        </>
      )}
    </div>
  );
}

Cart.propTypes = {
  cart: PropTypes.arrayOf(PropTypes.shape({
    itemId: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
  })).isRequired,
  macItems: PropTypes.arrayOf(ItemType).isRequired,
  dispatch: PropTypes.func.isRequired,
  drinkItems: PropTypes.arrayOf(ItemType).isRequired,
  packItems: PropTypes.arrayOf(ItemType).isRequired,
  optionalItems: PropTypes.arrayOf(PropTypes.shape({
    category: PropTypes.string.isRequired,
    itemId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  })).isRequired,
  macList: PropTypes.arrayOf(PropTypes.shape({
    itemId: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
  })).isRequired,
  macListDispatch: PropTypes.func.isRequired,
};

export default Cart;
