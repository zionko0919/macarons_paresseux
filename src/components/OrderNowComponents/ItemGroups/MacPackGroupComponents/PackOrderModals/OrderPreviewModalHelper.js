/* eslint-disable no-unused-vars */
import { useContext } from 'react';
import PropTypes from 'prop-types';
import OrderContext from '../../../../../context/OrderContext';

function OrderPreviewModalHelper({ macListItem }) {
  const { macItems } = useContext(OrderContext);
  const item = macItems.find((i) => i.itemId === macListItem.itemId);

  console.log('type of macListItem: ', typeof macListItem);
  console.log('macListItem: ', macListItem);

  return (
    <tr>
      <td>{item.title}</td>
      <td>{macListItem.quantity}</td>
    </tr>
  );
}

// OrderPreviewModalHelper.propTypes = {
//   macListItem: PropTypes.arrayOf(PropTypes.shape({
//     itemId: PropTypes.string.isRequired,
//     quantity: PropTypes.number.isRequired,
//   })).isRequired,
// };

OrderPreviewModalHelper.propTypes = {
  macListItem: PropTypes.shape({
    itemId: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
};

export default OrderPreviewModalHelper;
