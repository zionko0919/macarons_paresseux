/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';

function PackOrderMacListViewer({ macList }) {
  return (
    <div>
      <p>(Test Component)</p>
      <button type="button">Start Over</button>
      <p>Macaron List: </p>
    </div>
  );
}

PackOrderMacListViewer.propTypes = {
  macList: PropTypes.arrayOf(PropTypes.shape({
    itemId: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
  })).isRequired,
};

export default PackOrderMacListViewer;
