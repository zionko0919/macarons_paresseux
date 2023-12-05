/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import {
  Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider,
} from '@mui/material';
import OrderContext from '../../../../../context/OrderContext';
import PackOrderModalContext from '../../../../../context/PackOrderModalContext';
import PackOrderMacListViewer from '../PackOrderMacListViewer';
import { itemImages } from '../../../../../items';
import SelectMacaronThumbnail from './SelectMacaronThumbnail';
import './SelectMacModal.css';

function SelectMacModal({ title, numMac, onNext }) {
  const { macList, macItems } = useContext(OrderContext);
  const { isSelectMacModalOpen, handleSelectMacModalClose } = useContext(PackOrderModalContext);

  const totalQuantitySelected = macList.reduce((acc, item) => item.quantity + acc, 0);

  return (
    <Dialog
      className="select-mac-modal-component"
      open={isSelectMacModalOpen}
      onClose={handleSelectMacModalClose}
    >
      <Button type="button" onClick={handleSelectMacModalClose}>Close X</Button>
      <DialogTitle>
        {title}
      </DialogTitle>
      <Divider />
      <PackOrderMacListViewer
        numMac={numMac}
        totalQuantitySelected={totalQuantitySelected}
      />
      <Divider />
      <DialogContent>
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
      </DialogContent>
      <DialogActions>
        <Button
          type="button"
          onClick={onNext}
          disabled={numMac !== totalQuantitySelected}
        >
          Next
        </Button>
      </DialogActions>
    </Dialog>
  );
}

SelectMacModal.propTypes = {
  title: PropTypes.string.isRequired,
  numMac: PropTypes.number.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default SelectMacModal;
