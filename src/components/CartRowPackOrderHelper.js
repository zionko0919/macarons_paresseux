import PropTypes from 'prop-types';
import ItemType from '../types/item';

function CartRowPackOrderHelper({ macList, macItems }) {
  console.log('hi: ', macList);
  return (
    <div className="cart-row-pack-order-helper-component">
      <thead>
        <tr>
          <th>Item</th>
          <th>Quantity</th>
        </tr>
      </thead>
      <tbody>
        {macList.map((item) => (
          <tr key={item.itemId}>
            <td>{macItems.find((i) => i.itemId === item.itemId).title}</td>
            <td>{item.quantity}</td>
          </tr>
        ))}
      </tbody>
    </div>
  );
}

CartRowPackOrderHelper.propTypes = {
  macList: PropTypes.arrayOf(PropTypes.shape({
    itemId: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
  })).isRequired,
  macItems: PropTypes.arrayOf(ItemType).isRequired,
};

export default CartRowPackOrderHelper;
