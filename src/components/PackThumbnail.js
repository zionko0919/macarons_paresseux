/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { useState } from 'react';
import './PackThumbnail.css';
import PackOrderModalPageOne from './PackOrderModalPageOne';
import { PackMacListTypes } from '../reducers/packMacListReducer';
import ItemType from '../types/item';

function PackThumbnail({
  image, title, price, numMac, addToCart, packItems, macItems,
  macList, macListDispatch,
}) {
  const [isModalOneOpen, setIsModalOpen] = useState(false);

  // const removeItemFromMacList = () => {
  //   macListDispatch({ type: PackMacListTypes.REMOVE, itemId: macList.itemId });
  // };

  const handleModalOneOpen = () => {
    setIsModalOpen(true);
    // console.log('Opening Pack Order Modal Page 1 for ', title);
  };

  const handleModalOneClose = () => {
    setIsModalOpen(false);
    macListDispatch({ type: PackMacListTypes.EMPTY });
    // console.log('Closing from Pack Order Modal Page 1 for ', title);
  };

  return (
    <div className="pack-thumbnail-component">
      <div className="pack-thumbnail-popup-component">
        <button
          className="pack-thumbnail-button"
          type="button"
          onClick={handleModalOneOpen}
        >
          <img className="pack-thumbnail-image" src={image} alt={title} />
        </button>
        <PackOrderModalPageOne
          isModalOneOpen={isModalOneOpen}
          handleModalOneClose={handleModalOneClose}
          numMac={numMac}
          addToCart={addToCart}
          packTitle={title}
          packItems={packItems}
          macItems={macItems}
          macList={macList}
          macListDispatch={macListDispatch}
        />
      </div>
      <p>{title}</p>
      <p>
        $
        {price.toFixed(2)}
      </p>
    </div>
  );
}

PackThumbnail.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  numMac: PropTypes.number.isRequired,
  addToCart: PropTypes.func.isRequired,
  packItems: PropTypes.arrayOf(ItemType).isRequired,
  macItems: PropTypes.arrayOf(ItemType).isRequired,
  macList: PropTypes.arrayOf(PropTypes.shape({
    itemId: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
  })).isRequired,
  macListDispatch: PropTypes.func.isRequired,
};

export default PackThumbnail;
