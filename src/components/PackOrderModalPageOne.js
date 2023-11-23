/* eslint-disable no-unused-vars */
import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Dialog, DialogTitle, DialogContent, DialogContentText,
} from '@mui/material';
import OrderContext from '../context/OrderContext';
import { itemImages } from '../items';
import SelectMacaronThumbnail from './SelectMacaronThumbnail';
import PackOrderModalPageTwo from './PackOrderModalPageTwo';
import './PackOrderModalPageOne.css';
import PackOrderMacListViewer from './PackOrderMacListViewer';
import PackOrderModalContext from '../context/PackOrderModalContext';

function PackOrderModalPageOne({
  isModalOneOpen,
  handleModalOneClose,
  handlModalOneCloseAfterAddToCart,
  numMac,
  packTitle,
}) {
  const { macList, macItems } = useContext(OrderContext);
  const { isFirstModalOpen, handleFirstModalClose } = useContext(PackOrderModalContext);

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
        // open={isModalOneOpen}
        // onClose={handleModalOneClose}
        open={isFirstModalOpen}
        onClose={handleFirstModalClose}
      >
        <Button
          type="button"
          // onClick={handleModalOneClose}
          onClick={handleFirstModalClose}
        >
          Close X

        </Button>
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
          <PackOrderMacListViewer />
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
        handlModalOneCloseAfterAddToCart={handlModalOneCloseAfterAddToCart}
        handleModalTwoClose={handleModalTwoClose}
        packTitle={packTitle}
      />
    </>
  );
}

PackOrderModalPageOne.propTypes = {
  isModalOneOpen: PropTypes.bool.isRequired,
  handleModalOneClose: PropTypes.func.isRequired,
  handlModalOneCloseAfterAddToCart: PropTypes.func.isRequired,
  numMac: PropTypes.number.isRequired,
  packTitle: PropTypes.string.isRequired,
};

export default PackOrderModalPageOne;
