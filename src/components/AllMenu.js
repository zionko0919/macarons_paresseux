import { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import MacMenu from './MacMenu';
import MenuDetails from './MenuDetails';
import MenuDetailItem from './MenuDetailItem';
import OrderContext from '../context/OrderContext';
import './AllMenu.css';

function AllMenu() {
  const { macItems } = useContext(OrderContext);

  return (
    <div className="all-menu-component">
      <h1>Macarons</h1>
      {macItems.length === 0
        ? <h5>Loading...</h5>
        : (
          <Routes>
            <Route path="/" element={<MacMenu />} />
            <Route path="/details" element={<MenuDetails />}>
              <Route
                path=":id"
                element={<MenuDetailItem />}
              />
              <Route index element={<div>No Item Selected</div>} />
            </Route>
          </Routes>
        )}

    </div>

  );
}

export default AllMenu;
