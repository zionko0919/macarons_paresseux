import { useContext } from 'react';
import PropTypes from 'prop-types';
import OrderContext from '../context/OrderContext';
import { PackMacListTypes } from '../reducers/packMacListReducer';

function PackOrderMacListViewer({ macListItem }) {
  const { macItems, macListDispatch } = useContext(OrderContext);
  const item = macItems.find((i) => i.itemId === macListItem.itemId);

  const removeItemFromMacList = () => {
    macListDispatch({ type: PackMacListTypes.REMOVE, itemId: item.itemId });
    // console.log('removing: ', item);
  };

  return (
    <tr>
      <td>{item.title}</td>
      <td>{macListItem.quantity}</td>
      <td>
        <button type="button" onClick={removeItemFromMacList}>X</button>
      </td>
    </tr>
  );
}

PackOrderMacListViewer.propTypes = {
  macListItem: PropTypes.arrayOf(PropTypes.shape({
    itemId: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
  })).isRequired,
};

export default PackOrderMacListViewer;
