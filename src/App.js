/* eslint-disable no-unused-vars */
import axios from 'axios';
import {
  useCallback, useEffect, useReducer, useState, useMemo, useRef,
} from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import { Container } from '@mui/material';
import AllMenu from './components/MenuComponents/AllMenu';
import Cart from './components/Cart';
import OrderNow from './components/OrderNowComponents/OrderNow';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import NotFound from './components/NotFound';
import { cartReducer, initialCartState, CartTypes } from './reducers/cartReducer';
import { packMacListReducer, initialPackMacListState, PackMacListTypes } from './reducers/packMacListReducer';
import CurrentUserContext from './context/CurrentUserContext';
import OrderContext from './context/OrderContext';
import Login from './components/Login';
import Dashboard from './components/Orders';

const storageKey = 'cart';

function App() {
  const [macItems, setMacItems] = useState([]);
  const [packItems, setPackItems] = useState([]);
  const [drinkItems, setDrinkItems] = useState([]);
  const [optionalItems, setOptionalItems] = useState([]);

  const [isGiftOptionSelected, setIsGiftOptionSelected] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  const [giftSenderName, setGiftSenderName] = useState('');

  const [pickUpDate, setPickUpDate] = useState('date0'); // Initial value for today
  const [pickUpTime, setPickUpTime] = useState('ASAP');
  const [pickUpDateString, setPickUpDateString] = useState('');
  const [pickUpDateTime, setPickUpDateTime] = useState('');

  const [currentUser, setCurrentUser] = useState({});

  // console.log('GiftOption?: ', isGiftOptionSelected);
  // console.log('GiftMSG: ', giftMessage);
  // console.log('GiftSender:', giftSenderName);
  const giftOptionInfo = useMemo(() => ({
    isGiftOptionSelected,
    giftMessage,
    giftSenderName,
  }), [isGiftOptionSelected, giftMessage, giftSenderName]);
  // console.log(giftOptionInfo);

  // const giftOptionInfo = useMemo(
  //   () => (
  //     [{ isGiftOptionSelected }, { giftMessage }, { giftSenderName }]),
  //   [isGiftOptionSelected, giftMessage, giftSenderName],
  // );

  const [macList, macListDispatch] = useReducer(packMacListReducer, initialPackMacListState);
  const addToMacList = useCallback(
    (itemId) => macListDispatch({ type: PackMacListTypes.ADD, itemId }),
    [],
  );
  const [cart, dispatch] = useReducer(
    cartReducer,
    initialCartState,
    (initialState) => {
      try {
        const storedCart = JSON.parse(localStorage.getItem(storageKey));
        return storedCart || initialState;
      } catch (error) {
        console.log('Error parsing cart', error);
        return initialState;
      }
    },
  );
  const addToCart = useCallback(
    (itemId, category) => dispatch({
      type: CartTypes.ADD,
      itemId,
      category,
      macList,
      giftOptionInfo,
    }),
    [macList, giftOptionInfo],
  );

  // console.log('macList test in App: ', macList);
  // console.log('cart: ', cart);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    axios.get('/api/macaronItems')
      .then((result) => setMacItems(result.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    axios.get('/api/macaronPacks')
      .then((result) => setPackItems(result.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    axios.get('/api/drinkItems')
      .then((result) => setDrinkItems(result.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    axios.get('api/optionalItems')
      .then((result) => setOptionalItems(result.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    axios.get('api/auth/current-user')
      .then((result) => setCurrentUser(result.data))
      .catch(console.error);
  }, []);

  const currentUserContextValue = useMemo(
    () => ({ currentUser, setCurrentUser }),
    [currentUser],
  );

  const OrderContextValues = useMemo(
    () => ({
      macItems,
      packItems,
      drinkItems,
      optionalItems,
      addToCart,
      macList,
      macListDispatch,
      addToMacList,
      isGiftOptionSelected,
      setIsGiftOptionSelected,
      giftMessage,
      setGiftMessage,
      giftSenderName,
      setGiftSenderName,
      pickUpDate,
      setPickUpDate,
      pickUpTime,
      setPickUpTime,
      pickUpDateString,
      setPickUpDateString,
      pickUpDateTime,
      setPickUpDateTime,
    }),
    [
      macItems,
      packItems,
      drinkItems,
      optionalItems,
      addToCart,
      macList,
      macListDispatch,
      addToMacList,
      isGiftOptionSelected,
      setIsGiftOptionSelected,
      giftMessage,
      setGiftMessage,
      giftSenderName,
      setGiftSenderName,
      pickUpDate,
      setPickUpDate,
      pickUpTime,
      setPickUpTime,
      pickUpDateString,
      setPickUpDateString,
      pickUpDateTime,
      setPickUpDateTime,
    ],
  );

  // console.log(pickUpDateString);
  // console.log(pickUpTime);

  return (
    <Router>
      <CurrentUserContext.Provider
        value={currentUserContextValue}
      >
        <OrderContext.Provider
          value={OrderContextValues}
        >
          <Header cart={cart} />
          {/* <Container> */}
          {drinkItems.length === 0 || macItems.length === 0 || packItems.legnth === 0
            ? <div>Loading...</div>
            : (
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/orders/*"
                  element={(
                    <Dashboard />
              )}
                />
                <Route
                  path="/cart"
                  element={(
                    <Cart
                      cart={cart}
                      dispatch={dispatch}
                    />
                )}
                />
                <Route
                  path="/all_menu/*"
                  element={(
                    <AllMenu />
                )}
                />
                <Route
                  path="/ordernow/*"
                  element={(
                    <OrderNow />
                )}
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            )}
          {/* </Container> */}
          <Footer />
        </OrderContext.Provider>
      </CurrentUserContext.Provider>
    </Router>
  );
}

export default App;
