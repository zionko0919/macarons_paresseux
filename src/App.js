/* eslint-disable no-unused-vars */
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import axios from 'axios';
import { useEffect, useReducer, useState } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import AllMenu from './components/AllMenu';
import NotFound from './components/NotFound';
import OrderNow from './components/OrderNow';
import Cart from './components/Cart';
import { cartReducer, initialCartState, CartTypes } from './reducers/cartReducer';
import { packMacListReducer, initialPackMacListState, PackMacListTypes } from './reducers/packMacListReducer';
// import MenuDetails from './components/MenuDetails';

const storageKey = 'cart';

function App() {
  const [macItems, setItems] = useState([]);

  // const [cart, dispatch] = useReducer(
  //   cartReducer,
  //   initialCartState,
  // );
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

  const addToCart = (itemId, category) => dispatch(
    { type: CartTypes.ADD, itemId, category },
  );

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    axios.get('/api/macaronItems')
      .then((result) => setItems(result.data))
      .catch(console.error);
  }, []);

  const [packItems, setPackItems] = useState([]);
  useEffect(() => {
    axios.get('/api/macaronPacks')
      .then((result) => setPackItems(result.data))
      .catch(console.error);
  }, []);

  const [drinkItems, setDrinkItems] = useState([]);
  useEffect(() => {
    axios.get('/api/drinkItems')
      .then((result) => setDrinkItems(result.data))
      .catch(console.error);
  }, []);

  const [optionalItems, setOptionalItems] = useState([]);
  useEffect(() => {
    axios.get('api/optionalItems')
      .then((result) => setOptionalItems(result.data))
      .catch(console.error);
  }, []);

  const [macList, macListDispatch] = useReducer(packMacListReducer, initialPackMacListState);
  const addToMacList = (itemId) => macListDispatch(
    { type: PackMacListTypes.ADD, itemId },
  );

  // console.log('cart: ', cart);
  // console.log('macList', macList);

  return (
    <Router>
      <Header cart={cart} />
      <Routes>
        <Route path="/" element={<Home />} />
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
    </Router>
  );
}

export default App;
