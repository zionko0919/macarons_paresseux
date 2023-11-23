import { useContext } from 'react';
import OrderContext from '../context/OrderContext';

function CartRowPackOrderHelper() {
  const { macItems, macList } = useContext(OrderContext);

  return (
    <div className="cart-row-pack-order-helper-component">
      <thead>
        <tr>
          <th>Macaron</th>
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

export default CartRowPackOrderHelper;
