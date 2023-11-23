/* eslint-disable no-unused-vars */
import { useContext } from 'react';
import PropTypes from 'prop-types';
import OrderContext from '../context/OrderContext';
import { PackMacListTypes } from '../reducers/packMacListReducer';

function PackOrderModalPageThreeHelper({
  macListItem,
}) {
  const { macItems } = useContext(OrderContext);
  const item = macItems.find((i) => i.itemId === macListItem.itemId);

  return (
    <tr>
      <td>{item.title}</td>
      <td>{macListItem.quantity}</td>
    </tr>
  );
}

PackOrderModalPageThreeHelper.propTypes = {
  macListItem: PropTypes.arrayOf(PropTypes.shape({
    itemId: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
  })).isRequired,
};

export default PackOrderModalPageThreeHelper;
