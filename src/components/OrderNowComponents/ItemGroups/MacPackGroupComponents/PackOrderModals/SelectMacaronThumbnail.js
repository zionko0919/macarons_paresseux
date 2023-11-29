/* eslint-disable no-unused-vars */
import { useContext } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import OrderContext from '../../../../../context/OrderContext';
import './SelectMacaronThumbnail.css';

function SelectMacaronThumbnail({
  itemId, image, title,
  numMac, totalQuantitySelected,
}) {
  const {
    macItems, macList, macListDispatch, addToMacList,
  } = useContext(OrderContext);
  const macSingleItem = macItems.find((item) => item.title === title);
  const addItemToMacList = () => {
    addToMacList(macSingleItem.itemId);
  };

  return (
    <div className="select-macaron-thumbnail-component">
      <div>
        <Button type="button" onClick={addItemToMacList} disabled={totalQuantitySelected >= numMac}>
          <img className="select-macaron-thumbnail-image" src={image} alt={title} />
        </Button>
      </div>
      <p>{title}</p>
    </div>
  );
}

SelectMacaronThumbnail.propTypes = {
  itemId: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  numMac: PropTypes.number.isRequired,
  totalQuantitySelected: PropTypes.number.isRequired,
};

export default SelectMacaronThumbnail;
