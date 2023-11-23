/* eslint-disable no-unused-vars */
import { useContext } from 'react';
import PropTypes from 'prop-types';
import OrderContext from '../context/OrderContext';
import PackOrderMacListViewerRow from './PackOrderMacListViewerRow';

function PackOrderMacListViewer() {
  const { macList } = useContext(OrderContext);

  return (
    <div className="pack-order-mac-list-component">
      <h3>Current Selection (#Testing)</h3>
      {/* <button type="button">Start Over</button> */}
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {macList.map((item) => (
            <PackOrderMacListViewerRow
              key={item.itemId}
              macListItem={item}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PackOrderMacListViewer;
