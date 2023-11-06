import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import GastonMacaronLogo from '../images/logos_icons/gaston_macaron_small_logo.png';
import CartIcon from '../images/cart.svg';
import './Header.css';

function Header({ cart }) {
  const cartQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
  return (
    <header className="header-component">
      <Link to="/">
        <img src={GastonMacaronLogo} alt="gaston macaron logo" />
        <h1>Macarons Paresseux</h1>
      </Link>
      <div className="menu">
        <Link to="/cart">
          <img src={CartIcon} alt="Cart" />
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
