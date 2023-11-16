import axios from 'axios';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ItemType from '../types/item';
import './Orders.css';

function Orders({
  macItems, drinkItems, packItems, optionalItems,
}) {
  const [orders, setOrders] = useState([]);

  useEffect(
    () => {
      axios.get('/api/orders')
        .then((result) => setOrders(result.data))
        .catch(console.error);
    },
    [],
  );

  return (
    <div className="orders-component">
      <h2>Exisiting Orders</h2>
      {orders.length === 0
        ? <div>No Orders</div>
        : orders.map((order) => (
          <div className="order" key={order.id}>
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>ZIP Code</th>
                  {order.phone && <th>Phone</th>}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{order.name}</td>
                  <td>{order.zipCode}</td>
                  {order.phone && <td>{order.phone}</td>}
                </tr>
              </tbody>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.itemId}>
                    <td>{item.quantity}</td>
                    <td>{items.find((i) => i.itemId === item.itemId)?.title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
    </div>
  );
}

Orders.propTypes = {
  packItems: PropTypes.arrayOf(ItemType).isRequired,
  drinkItems: PropTypes.arrayOf(ItemType).isRequired,
  macItems: PropTypes.arrayOf(ItemType).isRequired,
  optionalItems: PropTypes.arrayOf(PropTypes.shape({
    category: PropTypes.string.isRequired,
    itemId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  })).isRequired,
};

export default Orders;
