/* eslint-disable no-unused-vars */
import axios from 'axios';
import {
  useCallback, useEffect, useReducer, useState, useMemo,
} from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import { Menu } from '@mui/icons-material';
import {
  Drawer, Box, Button, List, ListItem, ListItemButton, ListItemText,
} from '@mui/material';
import AllMenu from './components/AllMenu';
import Cart from './components/Cart';
import OrderNow from './components/OrderNow';
import Header from './components/Header';
import Home from './components/Home';
import NotFound from './components/NotFound';
import { cartReducer, initialCartState, CartTypes } from './reducers/cartReducer';
import { packMacListReducer, initialPackMacListState, PackMacListTypes } from './reducers/packMacListReducer';
import CurrentUserContext from './context/CurrentUserContext';
import Login from './components/Login';
import Orders from './components/Orders';

const storageKey = 'cart';

function App() {
  const [macItems, setItems] = useState([]);
  const [packItems, setPackItems] = useState([]);
  const [drinkItems, setDrinkItems] = useState([]);
  const [optionalItems, setOptionalItems] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
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

  const [macList, macListDispatch] = useReducer(packMacListReducer, initialPackMacListState);
  const addToMacList = (itemId) => macListDispatch(
    { type: PackMacListTypes.ADD, itemId },
  );

  const addToCart = useCallback(
    (itemId, category) => dispatch({ type: CartTypes.ADD, itemId, category }),
    [],
  );

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    axios.get('/api/macaronItems')
      .then((result) => setItems(result.data))
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
  // console.log('cart: ', cart);
  // console.log('macList', macList);

  return (
    <Router>
      <CurrentUserContext.Provider
        value={currentUserContextValue}
      >
        <Header cart={cart} />
        {drinkItems.length === 0 || macItems.length === 0 || packItems.legnth === 0
          ? <div>Loading...</div>
          : (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/orders"
                element={(
                  <Orders
                    macItems={macItems}
                    drinkItems={drinkItems}
                    packItems={packItems}
                    optionalItems={optionalItems}
                  />
              )}
              />
              <Route
                path="/cart"
                element={(
                  <Cart
                    cart={cart}
                    dispatch={dispatch}
                    macItems={macItems}
                    drinkItems={drinkItems}
                    packItems={packItems}
                    optionalItems={optionalItems}
                    macList={macList}
                    macListDispatch={macListDispatch}
                  />
                )}
              />
              <Route
                path="/all_menu/*"
                element={(
                  <AllMenu
                    addToCart={addToCart}
                    macItems={macItems}
                  />
                )}
              />
              <Route
                path="/ordernow/*"
                element={(
                  <OrderNow
                    packItems={packItems}
                    drinkItems={drinkItems}
                    macItems={macItems}
                    optionalItems={optionalItems}
                    addToCart={addToCart}
                    macList={macList}
                    macListDispatch={macListDispatch}
                    addToMacList={addToMacList}
                  />
                )}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          )}
      </CurrentUserContext.Provider>
    </Router>
  );
}

export default App;
