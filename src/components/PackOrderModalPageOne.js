/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  Button, Dialog, DialogTitle, DialogContent, DialogContentText,
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
  console.log('macList: ', macList);

  const [isModalTwoOpen, setIsModalTwoOpen] = useState(false);

  const handleModalTwoOpen = () => {
    setIsModalTwoOpen(true);
  };

  const handleModalTwoClose = () => {
    setIsModalTwoOpen(false);
  };

  const totalQuantitySelected = macList.reduce((acc, item) => item.quantity + acc, 0);

  return (
    <>
      <Dialog
        className="pack-order-modal-page-one-dialog"
        open={isModalOneOpen}
        onClose={handleModalOneClose}
      >
        <Button type="button" onClick={handleModalOneClose}>Close X</Button>
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
        <Button
          type="button"
          onClick={handleModalTwoOpen}
          disabled={numMac !== totalQuantitySelected}
        >
          Next
        </Button>
      </Dialog>
      <PackOrderModalPageTwo
        isModalTwoOpen={isModalTwoOpen}
        handleModalOneClose={handleModalOneClose}
        handleModalTwoClose={handleModalTwoClose}
        packTitle={packTitle}
        addToCart={addToCart}
        packItems={packItems}
        macList={macList}
        macItems={macItems}
        macListDispatch={macListDispatch}
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
