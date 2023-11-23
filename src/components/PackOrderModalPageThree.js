/* eslint-disable no-unused-vars */
import { useContext } from 'react';
import PropTypes from 'prop-types';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogContentText,
} from '@mui/material';
import OrderContext from '../context/OrderContext';
import { PackMacListTypes } from '../reducers/packMacListReducer';
import PackOrderMacListViewer from './PackOrderMacListViewerRow';
import PackOrderModalPageThreeHelper from './PackOrderModalPageThreeHelper';
import './PackOrderModalPageThree.css';

function PackOrderModalPageThree({
  handleModalOneClose,
  handlModalOneCloseAfterAddToCart,
  handleModalTwoClose,
  isModalThreeOpen,
  handleModalThreeClose,
  packTitle,
  giftMessage,
  giftFromName,
  giftOption,
  setGiftOption,
  setGiftMessage,
  setGiftFromName,
}) {
  const { packItems, macList, addToCart } = useContext(OrderContext);

  const closeAllModals = () => {
    setGiftOption(false);
    setGiftMessage('');
    setGiftFromName('');
    handleModalThreeClose();
    handleModalTwoClose();
    handleModalOneClose();
  };

  const closeAfterAddToCart = () => {
    setGiftOption(false);
    setGiftMessage('');
    setGiftFromName('');
    handleModalThreeClose();
    handleModalTwoClose();
    handlModalOneCloseAfterAddToCart();
  };

  const selectedPack = packItems.find((item) => item.title === packTitle);

  const addItemToCart = () => {
    addToCart(selectedPack.itemId, selectedPack.category);
    // macListDispatch({ type: PackMacListTypes.EMPTY });
    closeAfterAddToCart();
  };

  return (
    <Dialog
      className="pack-order-modal-page-three-dialog"
      open={isModalThreeOpen}
      onClose={handleModalThreeClose}
    >
      <Button type="button" onClick={closeAllModals}>Close X</Button>
      <DialogTitle className="pack-order-modal-page-three-dialog-title">
        Is this correct? (#Testing)
      </DialogTitle>
      <DialogContent className="pack-order-modal-page-three-dialog-content" dividers>
        <DialogContentText className="pack-order-modal-page-three-dialog-content-text">
          (#Should include Pack-Name, list of Macs, GiftOption)
          {'\n'}
          {selectedPack.title}
          {'\n'}
        </DialogContentText>
        <table>
          <thead>
            <tr>
              <th>Macaron</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {macList.map((item) => (
              <PackOrderModalPageThreeHelper
                key={item.itemId}
                macListItem={item}
              />
            ))}
          </tbody>
        </table>
        <Box>
          <DialogContentText>
            { giftOption ? (
              <>
                <DialogContentText>
                  Message:
                  {' '}
                  {giftMessage}
                </DialogContentText>
                <DialogContentText>
                  From:
                  {' '}
                  {giftFromName}
                </DialogContentText>
              </>
            ) : ''}
          </DialogContentText>
        </Box>
      </DialogContent>
      <Button type="button" onClick={addItemToCart}>ADD TO CART</Button>
      <Button type="button" onClick={handleModalThreeClose}>Go Back</Button>
    </Dialog>
  );
}

PackOrderModalPageThree.propTypes = {
  handleModalOneClose: PropTypes.func.isRequired,
  handlModalOneCloseAfterAddToCart: PropTypes.func.isRequired,
  handleModalTwoClose: PropTypes.func.isRequired,
  isModalThreeOpen: PropTypes.bool.isRequired,
  handleModalThreeClose: PropTypes.func.isRequired,
  packTitle: PropTypes.string.isRequired,
  giftMessage: PropTypes.string.isRequired,
  giftFromName: PropTypes.string.isRequired,
  giftOption: PropTypes.bool.isRequired,
  setGiftOption: PropTypes.func.isRequired,
  setGiftMessage: PropTypes.func.isRequired,
  setGiftFromName: PropTypes.func.isRequired,
};

export default PackOrderModalPageThree;
