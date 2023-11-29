/* eslint-disable no-unused-vars */
import { useContext } from 'react';
import PropTypes from 'prop-types';
import OrderContext from '../../../../context/OrderContext';
import PackOrderMacListViewerRow from './PackOrderMacListViewerRow';

function PackOrderMacListViewer({ numMac, totalQuantitySelected }) {
  const { macList } = useContext(OrderContext);

  const testingOrderArray = macList.map((item) => (
    <PackOrderMacListViewerRow
      key={item.itemId}
      macListItem={item}
    />
  ));

  console.log('testingOrderArr: ', testingOrderArray);

  return (
    <div className="pack-order-mac-list-component">
      <p>
        Select Your
        {' '}
        {numMac > 1 ? 'Macarons' : 'Macaron'}
      </p>
      <p>
        {' '}
        {numMac - totalQuantitySelected}
        {' '}
        Left
      </p>
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

PackOrderMacListViewer.propTypes = {
  numMac: PropTypes.number.isRequired,
  totalQuantitySelected: PropTypes.number.isRequired,
};

export default PackOrderMacListViewer;
