/* eslint-disable no-unused-vars */
import { Link } from 'react-router-dom';
import { useState } from 'react';
import PropTypes from 'prop-types';
import GastonMacaronLogo from '../images/logos_icons/gaston_macaron_small_logo.png';
import Sidebar from '../components/Sidebar';
import CartIcon from '../images/cart.svg';
import UserDetails from '../components/UserDetails';
import '../components/Header.css';
// import './HeaderCopy.css';

function Header({ cart }) {
  const cartQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <header className="header-component">
      <Link to="/">
        <img src={GastonMacaronLogo} alt="gaston macaron logo" className="header-logo" />
        <h1>Macarons Paresseux</h1>
      </Link>
      <div className="menu">
        <Sidebar isSidebarOpen={isSidebarOpen} onClose={toggleSidebar} />
        <Link to="/cart">
          <img src={CartIcon} alt="Cart" className="header-cart-icon" />
          <div className="badge">{cartQuantity}</div>
        </Link>
      </div>
    </header>
  );
}

Header.propTypes = {
  cart: PropTypes.arrayOf(PropTypes.shape({
    itemId: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
  })).isRequired,
};

export default Header;
