/* eslint-disable no-unused-vars */
import axios from 'axios';
import {
  useMemo, useState, useRef, useContext,
} from 'react';
import PropTypes from 'prop-types';
import { Button, Callout, TextField } from '@radix-ui/themes';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import OrderContext from '../context/OrderContext';
import { CartTypes } from '../reducers/cartReducer';
import CartRow from './CartRow';
import Alert from './Alert';
import './Cart.css';

function Cart({
  cart, dispatch,
}) {
  const {
    macItems, drinkItems, packItems, couponCodes,
  } = useContext(OrderContext);

  const [currentCoupon, setCurrentCoupon] = useState('');
  const [couponDiscountPercentage, setCouponDiscountPercentage] = useState(0);
  const [couponDiscountPrice, setCouponDiscountPrice] = useState(0);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [isEmployeeOfTheMonth, setIsEmployeeOfTheMonth] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [apiError, setApiError] = useState('');
  const debounceRef = useRef(null);
  const zipRef = useRef(null);

  // console.log('cart: ', cart);
  // console.log('cart.key: ', cart.key);

  const subTotal = isEmployeeOfTheMonth ? 0 : cart.reduce((acc, item) => {
    let detailItem = {};
    if (item.category === 'macaron') {
      detailItem = macItems.find((i) => i.itemId === item.itemId);
    } else if (item.category === 'drink') {
      detailItem = drinkItems.find((i) => i.itemId === item.itemId);
    } else if (item.category === 'pack') {
      detailItem = packItems.find((i) => i.itemId === item.itemId);
    }

    let itemPrice = detailItem.salePrice ?? detailItem.price;

    if (item.giftOption && item.giftOption.isGiftOptionSelected) {
      itemPrice += 1.5;
    }

    return item.quantity * itemPrice + acc;
  }, 0);

  const originalSubTotal = subTotal;
  const [discountedSubTotal, setDiscountedSubTotal] = useState(subTotal);

  const setCouponCodeForDiscount = (newCoupon) => {
    setCurrentCoupon(newCoupon);
  };

  const enteredCoupon = couponCodes.find((item) => item.code === currentCoupon.toUpperCase());
  let isCouponUsed = false;
  const applyCouponCodes = () => {
    if ((couponCodes.find((item) => item.code === currentCoupon.toUpperCase()))
    && !isCouponUsed) {
      const discountPercentageDecimal = enteredCoupon.percentage;
      const appliedDiscount = subTotal * discountPercentageDecimal;
      isCouponUsed = true;
      setCouponDiscountPercentage(enteredCoupon.percentage);
      setCouponDiscountPrice(appliedDiscount);
      setDiscountedSubTotal(subTotal - appliedDiscount);
    } else {
      console.log('Invalid Coupon Code');
    }
  };

  const resetCouponCodes = () => {
    setCurrentCoupon('');
    isCouponUsed = false;
    setCouponDiscountPercentage(0);
    setCouponDiscountPrice(0);
    setDiscountedSubTotal(originalSubTotal);
  };

  const taxRate = useMemo(
    () => {
      const taxPercentage = parseInt(zipCode.substring(0, 1) || '0', 10) + 1;
      return taxPercentage / 100;
    },
    [zipCode],
  );

  // const apiKey = '3qMWDxIFQDjuMGl7G0dUnw==CSKNGN3OaFZ9r3nI'; // Replace with your actual API key

  // async function getSalesTax() {
  //   try {
  //     const response = await fetch(`https://api.api-ninjas.com/v1/salestax?zip_code=${zipCode}`, {
  //       method: 'GET',
  //       headers: {
  //         'X-Api-Key': apiKey,
  //         'Content-Type': 'application/json',
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error(`Error: ${response.statusText}`);
  //     }

  //     const taxResult = await response.json();
  //     console.log(taxResult);
  //   } catch (error) {
  //     console.error('Error:', error.message);
  //   }
  // }

  // getSalesTax();

  const taxAmount = (discountedSubTotal < subTotal ? discountedSubTotal : subTotal) * taxRate;
  const total = (discountedSubTotal < subTotal ? discountedSubTotal : subTotal) + taxAmount;
  const isFormValid = zipCode.length === 5 && name.trim();

  const orderCreatedTime = new Date();
  const orderTimeLog = orderCreatedTime.toLocaleString('en-US', { timeZone: 'America/Chicago' });

  const submitOrder = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setApiError('');
    try {
      await axios.post('/api/orders', {
        items: cart,
        name,
        phone,
        zipCode,
        total,
        orderTimeLog,
        couponDiscountPercentage,
        couponDiscountPrice,
        subTotal,
        discountedSubTotal,
        taxAmount,
        taxRate,
      });
      dispatch({ type: CartTypes.EMPTY });
      setShowSuccessAlert(true);
    } catch (error) {
      console.error('Error submitting the order', error);
      setApiError(error?.response?.data?.error || 'Unknown Error');
    } finally {
      setIsSubmitting(false);
    }
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
    if (digits.length === 10) {
      zipRef.current.focus();
    }
    setPhone(formatted);
  };

  const onNameChange = (newName) => {
    setName(newName);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      axios
        .get(`/api/employees/isEmployeeOfTheMonth?name=${newName}`)
        .then((response) => setIsEmployeeOfTheMonth(
          response?.data?.isEmployeeOfTheMonth,
        ))
        .catch(console.error);
    }, 300);
  };

  return (
    <div className="cart-component">
      <Alert
        visible={showSuccessAlert}
        type="success"
      >
        Thank you for your order.
      </Alert>
      <Alert visible={!!apiError} type="error">
        <p>There was an error submitting your order. Please try again.</p>
        <p>
          Error:
          {' '}
          {apiError}
        </p>
      </Alert>
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
                <th>Gift Box</th>
                <th>More Info</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <CartRow
                  // key={item.itemId}
                  key={item.key}
                  cartItem={item}
                  dispatch={dispatch}
                />
              ))}
            </tbody>
          </table>
          <div>
            Discount: $
            {couponDiscountPrice.toFixed(2)}
            {' '}
            (
            {couponDiscountPercentage * 100}
            %)
          </div>
          <div>
            Subtotal: $
            {discountedSubTotal.toFixed(2)}
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
              <Callout.Root color="red" role="alert">
                <Callout.Icon>
                  <InfoCircledIcon />
                </Callout.Icon>
                <Callout.Text>
                  Enter your ZIP Code to get the total price.
                </Callout.Text>
              </Callout.Root>
            )}
          <h2>Promo Code</h2>
          <TextField.Root>
            <TextField.Input
              placeholder="Promo Code Here"
              size="3"
              type="text"
              value={currentCoupon}
              onChange={(event) => setCouponCodeForDiscount(event.target.value)}
            />
            <TextField.Slot>
              <Button type="button" onClick={applyCouponCodes}>Apply</Button>
              <Button type="button" onClick={resetCouponCodes}>Reset</Button>
            </TextField.Slot>
          </TextField.Root>
          <h2>Checkout</h2>
          <form onSubmit={submitOrder}>
            <label htmlFor="name">
              Name
              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => onNameChange(event.target.value)}
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
                aria-label="After a phone number is entered, you will automatically be moved to ZIP Code"
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
                ref={zipRef}
              />
            </label>
            <button type="submit" disabled={!isFormValid || isSubmitting}>
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
  dispatch: PropTypes.func.isRequired,
};

export default Cart;
