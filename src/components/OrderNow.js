/* eslint-disable no-unused-vars */
import { Route, Routes } from 'react-router-dom';
import MacPacks from './MacPacks';
import DrinkMenu from './DrinkMenu';
import './OrderNow.css';

function OrderNow() {
  return (
    <div className="ordernow-component">
      <h1>Macarons</h1>
      <Routes>
        <Route
          path="/*"
          element={(
            <MacPacks />
          )}
        />
      </Routes>
      <h1>Drinks</h1>
      <Routes>
        <Route
          path="/"
          element={(
            <DrinkMenu />
          )}
        />
      </Routes>
    </div>
  );
}

export default OrderNow;
