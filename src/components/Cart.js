/* eslint-disable no-unused-vars */
import axios from 'axios';
import {
  useMemo, useState, useRef, useContext, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import {
  Button, IconButton, TextField, Container, Box, InputBase, Paper, Grid,
  Alert as AlertMUI, TableHead, TableCell, Typography, Table, TableContainer, TableBody,
  TableRow, ButtonGroup, Stack,
} from '@mui/material';
import { Check, Replay, InfoOutlined } from '@mui/icons-material';
import OrderContext from '../context/OrderContext';
import { CartTypes } from '../reducers/cartReducer';
import CartRow from './CartRow';
import Alert from './Alert';
// import './Cart.css';
import DeliveryAddress from './DeliveryAddress';
import DateTime from './DateTime';

function Cart({
  cart, dispatch,
}) {
  const {
    macItems, drinkItems, packItems, pickUpDateString,
    pickUpTime, setPickUpTime, pickUpDateTime, setPickUpDateTime,
  } = useContext(OrderContext);

  const [couponCodes, setCouponCodes] = useState([]);
  useEffect(() => {
    axios.get('api/couponCodes')
      .then(((result) => setCouponCodes(result.data)))
      .catch(console.error);
  }, []);

  const [currentCoupon, setCurrentCoupon] = useState('');
  const [couponDiscountPercentage, setCouponDiscountPercentage] = useState(0);
  const [couponDiscountPrice, setCouponDiscountPrice] = useState(0);
  const [couponSuccessAlert, setCouponSuccessAlert] = useState(false);
  const [couponErrorAlert, setCouponErrorAlert] = useState(false);
  const [couponErrorMessage, setCouponErrorMessage] = useState('');
  const [dateTimeErrorAlert, setDateTimeErrorAlert] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardNumberAlert, setCardNumberAlert] = useState(false);
  const [cardNumberAlertMessage, setCardNumberAlertMessage] = useState('');
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
      itemPrice += 2.0;
    }

    return item.quantity * itemPrice + acc;
  }, 0);

  const originalSubTotal = subTotal;
  const [discountedSubTotal, setDiscountedSubTotal] = useState(subTotal);

  const setCouponCodeForDiscount = (newCoupon) => {
    setCurrentCoupon(newCoupon);
  };

  // if (cardNumber.length < 15) {
  //   setCardNumberAlert(true);
  //   setCardNumberAlertMessage
  // ('Plese check your card and try again. It should be at least 15-digits');
  // }

  let isCouponUsed = false;
  const [isCouponInputDisabled, setIsCouponInputDisabled] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const applyCouponCodes = () => {
    if (currentCoupon.length === 0) {
      setCouponErrorAlert(true);
      setCouponErrorMessage('Please Enter your Promo Code');
    }
    setCouponErrorAlert(false);
    setCouponSuccessAlert(false);
    const enteredCoupon = couponCodes.find(
      (item) => item.promoCode === currentCoupon.toUpperCase(),
    );

    if (enteredCoupon && !isCouponUsed) {
      if (!enteredCoupon.minPurchase || (subTotal >= enteredCoupon.minPurchase)) {
        isCouponUsed = true;
        setCouponSuccessAlert(true);
        let appliedDiscount;
        if (enteredCoupon.promoType === 'percentageOff') {
          const discountPercentageDecimal = enteredCoupon.percentage;
          appliedDiscount = subTotal * discountPercentageDecimal;
        } else if (enteredCoupon.promoType === 'amountOff') {
          appliedDiscount = enteredCoupon.discount;
        } else {
          setCouponErrorAlert(true);
          setCouponErrorMessage('We are sorry, we have encountered an unknown error.');
          return;
        }

        setCouponDiscountPercentage((appliedDiscount / subTotal) * 100);
        setCouponDiscountPrice(appliedDiscount);
        setDiscountedSubTotal(subTotal - appliedDiscount);
        setIsCouponInputDisabled(true);
        setIsButtonDisabled(true);
      } else if (enteredCoupon.minPurchase && subTotal < enteredCoupon.minPurchase) {
        isCouponUsed = false;
        setCouponErrorAlert(true);
        setCouponErrorMessage(`You need to purchase at least 
        $${enteredCoupon.minPurchase.toFixed(2)} to apply this promo code`);
        console.log(`You need to purchase at least $${enteredCoupon.minPurchase.toFixed(2)} to apply this promo code`);
      }
    } else {
      setCouponErrorAlert(true);
      setCouponErrorMessage(`
      ${currentCoupon} is Invalid`);
    }
  };

  const resetCouponCodes = () => {
    setIsCouponInputDisabled(false);
    setIsButtonDisabled(false);
    setCouponSuccessAlert(false);
    setCouponErrorAlert(false);
    setCouponErrorMessage('');
    setCurrentCoupon('');
    isCouponUsed = false;
    setCouponDiscountPercentage(0);
    setCouponDiscountPrice(0);
    setDiscountedSubTotal(originalSubTotal);
  };

  const taxRate = useMemo(
    () => {
      const texasTaxRate = 6.25;
      const countyTaxRate = 0;
      const austinTaxRate = 1;
      // const taxPercentage = parseInt(zipCode.substring(0, 1) || '0', 10) + 1;
      // return (taxPercentage) / 100;
      return (texasTaxRate + countyTaxRate + austinTaxRate) / 100;
    },
    // [zipCode],
    [],
  );

  // const apiKey = ''; // Replace with your actual API key

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
  const invoiceNumber = Date.now();
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
        // couponDiscountPercentage,
        // couponDiscountPrice,
        // subTotal,
        // discountedSubTotal,
        // taxAmount,
        // taxRate,
        pickUpDateString,
        pickUpTime,
        pickUpDateTime,
        invoiceNumber,
        currentCoupon: currentCoupon.length === 0 ? false : currentCoupon,
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

  // console.log(pickUpDateString, pickUpTime);

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

  const [showTimeSelectionError, setShowTimeSelectionError] = useState(false);
  // console.log(showTimeSelectionError);

  return (
    <Container className="cart-component">
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
          <Container maxWidth="md">
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableCell align="center" width="10%"><Typography variant="p">Quantity</Typography></TableCell>
                  <TableCell align="center"><Typography variant="p">Item</Typography></TableCell>
                  <TableCell align="center"><Typography variant="p">Price</Typography></TableCell>
                  <TableCell align="center"><Typography variant="p">Gift Box</Typography></TableCell>
                  <TableCell align="center"><Typography variant="p">More Info</Typography></TableCell>
                  <TableCell align="center"><Typography variant="p">Remove</Typography></TableCell>
                </TableHead>
                <TableBody>
                  {cart.map((item) => (
                    <CartRow
                  // key={item.itemId}
                      key={item.key}
                      cartItem={item}
                      dispatch={dispatch}
                    />
                  ))}
                </TableBody>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={4} />
                    <TableCell align="right">
                      <Typography variant="p" fontWeight="bold">
                        Discount
                        (
                        {couponDiscountPercentage.toFixed(1)}
                        %):
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="p" fontWeight="bold">
                        - $
                        {' '}
                        {couponDiscountPrice.toFixed(2)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={4} />

                    <TableCell align="right">
                      <Typography variant="p" fontWeight="bold">
                        Subtotal:
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="p" fontWeight="bold">
                        $
                        {' '}
                        {discountedSubTotal.toFixed(2)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  { zipCode.length === 5
                    ? (
                      <>
                        <TableRow>
                          <TableCell colSpan={4} />
                          <TableCell align="right">
                            <Typography variant="p" fontWeight="bold">
                              Tax (
                              { (taxRate * 100).toFixed(3) }
                              %):
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="p" fontWeight="bold">
                              + $
                              {' '}
                              { taxAmount.toFixed(2) }
                            </Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={4} />

                          <TableCell align="right">
                            <Typography variant="p" fontWeight="bold">
                              Total:
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="p" fontWeight="bold">
                              $
                              {' '}
                              { total.toFixed(2) }
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </>
                    ) : (
                      <TableCell colSpan={6}>
                        <AlertMUI icon={<InfoOutlined fontSize="inherit" />} severity="error" variant="filled">
                          Enter your billing ZIP Code to proceed.
                        </AlertMUI>
                      </TableCell>
                    )}
                </TableBody>
              </Table>
            </TableContainer>
          </Container>
          <h2>Promo Code</h2>
          <Container>
            <Box
              component="text"
              sx={{
                '& > :not(style)': { m: 1 },
              }}
            >
              <Grid container spacing={2}>
                <Grid item>
                  <TextField
                    size="small"
                    label="Promo Code"
                    type="text"
                    value={currentCoupon}
                    onChange={(event) => setCouponCodeForDiscount(event.target.value)}
                    disabled={isCouponInputDisabled}
                  />
                </Grid>
                <Grid item>
                  <Stack spacing={1} direction="row">
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={applyCouponCodes}
                      disabled={isButtonDisabled}
                    >
                      <Check />
                    </Button>
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={resetCouponCodes}
                      hidden
                    >
                      <Replay />
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Container>
          <Alert visible={couponSuccessAlert} type="success">
            {currentCoupon.toUpperCase()}
            {' '}
            is activiated.
          </Alert>
          <Alert visible={couponErrorAlert} type="error">
            {couponErrorMessage}
          </Alert>
          <h2>Store Pick-Up</h2>
          <Container>
            <Box component="text">
              <DateTime
                showTimeSelectionError={showTimeSelectionError}
                setShowTimeSelectionError={setShowTimeSelectionError}
              />
            </Box>
          </Container>
          <h2>Checkout</h2>
          <Container>
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
                Billing ZIP Code
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
              <label htmlFor="payment">
                Card Number
                <input
                  id="cardnumber"
                  type="text"
                  maxLength="16"
                  inputMode="numeric"
                  value={cardNumber}
                  onChange={(event) => setCardNumber(event.target.value)}
                />
              </label>
              <button type="submit" disabled={!isFormValid || isSubmitting || showTimeSelectionError}>
                Place Order
              </button>
              {cardNumber.length === 0
                ? (
                  <Alert visible={setCardNumberAlert} type="warning">
                    Do not enter real card numbers.
                    This is a demo app; entered numbers will not be stored.
                    You can proceed without a card number.
                  </Alert>
                ) : null }
            </form>
          </Container>
        </>
      )}
    </Container>
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
