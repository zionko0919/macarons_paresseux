/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import ItemType from '../types/item';
import PackOrderMacListViewerRow from './PackOrderMacListViewerRow';

function PackOrderMacListViewer({ macList, macItems, macListDispatch }) {
  // console.log('macList: ', macList);
  return (
    <div className="pack-order-mac-lis-component">
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
              macItems={macItems}
              macListDispatch={macListDispatch}
            />
          ))}
        </tbody>
      </table>

    </div>
  );
}

PackOrderMacListViewer.propTypes = {
  macList: PropTypes.arrayOf(PropTypes.shape({
    itemId: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
  })).isRequired,
  macItems: PropTypes.arrayOf(ItemType).isRequired,
  macListDispatch: PropTypes.func.isRequired,

};

export default PackOrderMacListViewer;
