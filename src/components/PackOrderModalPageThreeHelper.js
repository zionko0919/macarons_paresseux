/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import ItemType from '../types/item';
import { PackMacListTypes } from '../reducers/packMacListReducer';

function PackOrderModalPageThreeHelper({ macListItem, macItems, macListDispatch }) {
  const item = macItems.find((i) => i.itemId === macListItem.itemId);

  return (
    <tr>
      <td>{item.title}</td>
      <td>{macListItem.quantity}</td>
    </tr>
  );
}

PackOrderModalPageThreeHelper.propTypes = {
  macItems: PropTypes.arrayOf(ItemType).isRequired,
  macListItem: PropTypes.arrayOf(PropTypes.shape({
    itemId: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
  })).isRequired,
  macListDispatch: PropTypes.func.isRequired,
};

export default PackOrderModalPageThreeHelper;
