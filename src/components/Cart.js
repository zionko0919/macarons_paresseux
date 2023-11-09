/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { useState } from 'react';
import ItemType from '../types/item';
import CartRow from './CartRow';
import './Cart.css';

function Cart({
  cart, dispatch, macItems, drinkItems, packItems, optionalItems, macList, macListDispatch,
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [zipCode, setZipCode] = useState('');

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

    const itemPrice = detailItem.salePrice ?? detailItem.price;

    return item.quantity * itemPrice + acc;
  }, 0);

  const taxPercentage = parseInt(zipCode.substring(0, 1) || '0', 10) + 1;
  const taxRate = taxPercentage / 100;
  const taxAmount = subTotal * taxRate;
  const total = subTotal + taxAmount;
  const isFormValid = zipCode.length === 5 && name.trim();

  const submitOrder = (event) => {
    event.preventDefault();
    console.log('name: ', name);
    console.log('phone: ', phone);
    console.log('zipcode: ', zipCode);
  };

  const setFormattedPhone = (newNumber) => {
    const digits = newNumber.replace(/\D/g, '');
    let formatted = digits.substring(0, 3);
    if (digits.length === 3 && newNumber[3] === '-') {
      formatted = `${formatted}-`;
    } else if (digits.length > 3) {
      formatted = `${formatted}-${digits.substring(3, 6)}`;
    }
    if (digits.length === 6 && newNumber[7] === '-') {
      formatted = `${formatted}-`;
    } else if (digits.length > 6) {
      formatted = `${formatted}-${digits.substring(6, 10)}`;
    }
    setPhone(formatted);
  };

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
          { zipCode.length === 5
            ? (
              <>
                <div>
                  Tax (
                  { (taxRate * 100).toFixed(3) }
                  %): $
                  { taxAmount.toFixed(2) }
                </div>
                <div>
                  Total: $
                  { total.toFixed(2) }
                </div>
              </>
            ) : (
              <div className="warning">Enter ZIP Code to get total</div>
            )}
          <h2>Checkout</h2>
          <form onSubmit={submitOrder}>
            <label htmlFor="name">
              Name
              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </label>
            <label htmlFor="phone">
              Phone Number
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(event) => setFormattedPhone(event.target.value)}
              />
            </label>
            <label htmlFor="zipcode">
              ZIP Code
              <input
                id="zipcode"
                type="text"
                maxLength="5"
                inputMode="numeric"
                value={zipCode}
                onChange={(event) => setZipCode(event.target.value)}
                required
              />
            </label>
            <button type="submit" disabled={!isFormValid}>
              Place Order
            </button>
          </form>
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
