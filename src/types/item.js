// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';

const ItemType = PropTypes.shape({
  category: PropTypes.string.isRequired,
  itemId: PropTypes.string.isRequired,
  imageId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  description: PropTypes.string,
  salePrice: PropTypes.number,
  calories: PropTypes.number,
});

export default ItemType;
