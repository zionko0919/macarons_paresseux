import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogContentText,
} from '@mui/material';
import ItemType from '../types/item';
import { itemImages } from '../items';
import SelectMacaronThumbnail from './SelectMacaronThumbnail';
import PackOrderModalPageTwo from './PackOrderModalPageTwo';
import './PackOrderModalPageOne.css';
import PackOrderMacListViewer from './PackOrderMacListViewer';

function PackOrderModalPageOne({
  isModalOneOpen, handleModalOneClose, numMac, addToCart, packTitle, packItems, macItems,
  macList, macListDispatch,
}) {
  const [isModalTwoOpen, setIsModalTwoOpen] = useState(false);

  // console.log('macList from Modal 1: ', macList);

  const handleModalTwoOpen = () => {
    setIsModalTwoOpen(true);
    console.log('Opening Pack Order Modal Page 2');
  };

  const handleModalTwoClose = () => {
    setIsModalTwoOpen(false);
    console.log('Going back to Pack Order Modal Page 1');
  };

  const totalQuantitySelected = macList.reduce((acc, item) => item.quantity + acc, 0);

  return (
    <>
      <Dialog
        className="pack-order-modal-page-one-dialog"
        open={isModalOneOpen}
        onClose={handleModalOneClose}
      >
        <button type="button" onClick={handleModalOneClose}>Close X</button>
        <DialogTitle className="pack-order-modal-page-one-dialog-title">
          {packTitle}
          {'\n'}
          Select
          {' '}
          {numMac > 1 ? 'Macarons' : 'Macaron'}
        </DialogTitle>
        <DialogContent
          style={{ maxHeight: '120px' }}
          dividers
        >
          <PackOrderMacListViewer
            macList={macList}
            macItems={macItems}
            macListDispatch={macListDispatch}
          />
        </DialogContent>
        <DialogContent
          className="pack-order-modal-page-one-dialog-content"
          style={{ maxHeight: '500px' }}
          dividers
        >
          <DialogContentText
            className="pack-order-modal-page-one-dialog-content-text"
          >
            Testing Out the Content Box
            (Macaron Selection with images should be here)
            {macItems.map((item) => (
              <SelectMacaronThumbnail
                key={item.itemId}
                itemId={item.itemId}
                image={itemImages[item.imageId]}
                title={item.title}
                macList={macList}
                macListDispatch={macListDispatch}
                macItems={macItems}
                numMac={numMac}
                totalQuantitySelected={totalQuantitySelected}
              />
            ))}
          </DialogContentText>
        </DialogContent>
        <button
          type="button"
          onClick={handleModalTwoOpen}
          disabled={numMac !== totalQuantitySelected}
        >
          Next
        </button>
      </Dialog>
      <PackOrderModalPageTwo
        isModalTwoOpen={isModalTwoOpen}
        handleModalOneClose={handleModalOneClose}
        handleModalTwoClose={handleModalTwoClose}
        packTitle={packTitle}
        addToCart={addToCart}
        packItems={packItems}
      />
    </>
  );
}

PackOrderModalPageOne.propTypes = {
  isModalOneOpen: PropTypes.bool.isRequired,
  handleModalOneClose: PropTypes.func.isRequired,
  numMac: PropTypes.number.isRequired,
  addToCart: PropTypes.func.isRequired,
  packTitle: PropTypes.string.isRequired,
  packItems: PropTypes.arrayOf(ItemType).isRequired,
  macItems: PropTypes.arrayOf(ItemType).isRequired,
  macList: PropTypes.arrayOf(PropTypes.shape({
    itemId: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
  })).isRequired,
  macListDispatch: PropTypes.func.isRequired,
};

export default PackOrderModalPageOne;
