/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import './OrderNowThumbnail.css';

function OrderNowThumbnail({
  image, title, price, numMac,
}) {
  return (
    <div className="order-now-thumbnail-component">
      <div className="popup-component">
        <img className="image-component" src={image} alt={title} />
      </div>
      <p>{title}</p>
      <p>
        $
        {price.toFixed(2)}
      </p>
    </div>
  );
}

OrderNowThumbnail.propTypes = {
  price: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  numMac: PropTypes.number,
};

OrderNowThumbnail.defaultProps = {
  numMac: 0,
};

export default OrderNowThumbnail;
