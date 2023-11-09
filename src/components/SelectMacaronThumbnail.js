/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import { PackMacListTypes } from '../reducers/packMacListReducer';
import ItemType from '../types/item';
import './SelectMacaronThumbnail.css';

function SelectMacaronThumbnail({
  itemId, image, title,
  macList, macListDispatch, macItems, numMac, totalQuantitySelected, addToMacList,
}) {
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
  macList: PropTypes.arrayOf(PropTypes.shape({
    itemId: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
  })).isRequired,
  macListDispatch: PropTypes.func.isRequired,
  macItems: PropTypes.arrayOf(ItemType).isRequired,
  numMac: PropTypes.number.isRequired,
  totalQuantitySelected: PropTypes.number.isRequired,
  addToMacList: PropTypes.func.isRequired,
};

export default SelectMacaronThumbnail;
