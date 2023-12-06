/* eslint-disable no-unused-vars */
import {
  useCallback, useContext, useMemo, useState,
} from 'react';
import PropTypes from 'prop-types';
import OrderContext from '../../../../context/OrderContext';
import PackOrderModalContext from '../../../../context/PackOrderModalContext';
import { PackMacListTypes } from '../../../../reducers/packMacListReducer';
import SelectMacModal from './PackOrderModals/SelectMacModal';
import GiftOptionModal from './PackOrderModals/GiftOptionModal';
import OrderPreviewModal from './PackOrderModals/OrderPreviewModal';
import './PackThumbnail.css';

function PackThumbnail({
  image, title, price, numMac,
}) {
  const {
    macListDispatch, macList, isGiftOptionSelected,
    setIsGiftOptionSelected, setGiftMessage, setGiftSenderName,
  } = useContext(OrderContext);

  // const removeItemFromMacList = () => {
  //   macListDispatch({ type: PackMacListTypes.REMOVE, itemId: macList.itemId });
  // };

  const clearPreview = () => {
    macListDispatch({ type: PackMacListTypes.EMPTY });
    setIsGiftOptionSelected(false);
    setGiftMessage('');
    setGiftSenderName('');
  };

  const [isSelectMacModalOpen, setIsSelectMacModalOpen] = useState(false); // First Modal
  const [isGiftOptionModalOpen, setIsGiftOptionModalOpen] = useState(false); // Second Modal
  const [isOrderSummaryModalOpen, setIsOrderSummaryModalOpen] = useState(false); // Third Modal

  const handleSelectMacModalOpen = useCallback(() => setIsSelectMacModalOpen(true), []);
  const handleSelectMacModalClose = useCallback(() => setIsSelectMacModalOpen(false), []);
  const handleGiftOptionModalClose = useCallback(() => setIsGiftOptionModalOpen(false), []);
  const handleOrderSummaryModalClose = useCallback(() => setIsOrderSummaryModalOpen(false), []);

  const proceedToSecondModal = useCallback(() => {
    handleSelectMacModalClose();
    setIsGiftOptionModalOpen(true);
  }, [handleSelectMacModalClose]);

  const recedeToFirstModal = useCallback(() => {
    handleGiftOptionModalClose();
    setIsSelectMacModalOpen(true);
  }, [handleGiftOptionModalClose]);

  const proceedToThirdModal = useCallback(() => {
    handleGiftOptionModalClose();
    setIsOrderSummaryModalOpen(true);
  }, [handleGiftOptionModalClose]);

  const recedeToSecondModal = useCallback(() => {
    handleGiftOptionModalClose();
    handleOrderSummaryModalClose();
    setIsGiftOptionModalOpen(true);
  }, [handleGiftOptionModalClose, handleOrderSummaryModalClose]);

  const PackOrderModalContextValues = useMemo(
    () => ({
      isSelectMacModalOpen,
      handleSelectMacModalOpen,
      handleSelectMacModalClose,
      isGiftOptionModalOpen,
      handleGiftOptionModalClose,
      isOrderSummaryModalOpen,
      handleOrderSummaryModalClose,
      closeSecondOpenThird: proceedToThirdModal,
    }),
    [
      isSelectMacModalOpen,
      handleSelectMacModalOpen,
      handleSelectMacModalClose,
      isGiftOptionModalOpen,
      handleGiftOptionModalClose,
      isOrderSummaryModalOpen,
      handleOrderSummaryModalClose,
      proceedToThirdModal,
    ],
  );

  return (
    <PackOrderModalContext.Provider
      value={PackOrderModalContextValues}
    >
      <div className="pack-thumbnail-component">
        <div className="pack-thumbnail-popup-component">
          <button
            className="pack-thumbnail-button"
            type="button"
            onClick={handleSelectMacModalOpen}
          >
            <img className="pack-thumbnail-image" src={image} alt={title} />
          </button>
          <SelectMacModal
            title={title}
            numMac={numMac}
            onNext={proceedToSecondModal}
            clearPreview={clearPreview}
          />
          <GiftOptionModal
            onPrevious={recedeToFirstModal}
            onNext={proceedToThirdModal}
            clearPreview={clearPreview}
          />
          <OrderPreviewModal
            title={title}
            price={price}
            onPrevious={recedeToSecondModal}
            clearPreview={clearPreview}
          />
        </div>
        <p>{title}</p>
        <p>
          $
          {price.toFixed(2)}
        </p>
      </div>
    </PackOrderModalContext.Provider>
  );
}

PackThumbnail.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  numMac: PropTypes.number.isRequired,
};

export default PackThumbnail;
