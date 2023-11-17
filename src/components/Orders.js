/* eslint-disable no-unused-vars */
import axios from 'axios';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ItemType from '../types/item';
import './Orders.css';
import { useCurrentUserContext } from '../context/CurrentUserContext';

function Orders({
  macItems, drinkItems, packItems, optionalItems,
}) {
  const [orders, setOrders] = useState([]);

  const { currentUser } = useCurrentUserContext();

  const loadOrders = () => {
    axios.get('/api/orders')
      .then((result) => setOrders(result.data))
      .catch(console.error);
  };

  useEffect(
    () => {
      if (currentUser.access === 'associate') {
        loadOrders();
        return () => {
          setOrders([]);
        };
      }
      return () => { };
    },
    [currentUser],
  );

  const deleteOrder = async (order) => {
    try {
      await axios.delete(`api/orders/${order.id}`);
      loadOrders();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="orders-component">
      <h2>Exisiting Orders</h2>
      {orders.length === 0
        ? (
          <div>
            {currentUser.access === 'associate'
              ? 'No Orders'
              : 'Access Denied'}
          </div>
        )
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
                    <td>
                      {
                        (macItems.find((i) => i.itemId === item.itemId)?.title)
                        || (packItems.find((i) => i.itemId === item.itemId)?.title)
                        || (drinkItems.find((i) => i.itemId === item.itemId)?.title)
                        || (optionalItems.find((i) => i.itemId === item.itemId)?.title)
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              type="button"
              onClick={() => deleteOrder(order)}
            >
              Delete Order
            </button>
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
