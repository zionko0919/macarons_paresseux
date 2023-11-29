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
    macListDispatch, isGiftOptionSelected, setIsGiftOptionSelected,
  } = useContext(OrderContext);

  // const removeItemFromMacList = () => {
  //   macListDispatch({ type: PackMacListTypes.REMOVE, itemId: macList.itemId });
  // };

  const [isSelectMacModalOpen, setIsSelectMacModalOpen] = useState(false);
  const [isGiftOptionModalOpen, setIsGiftOptionModalOpen] = useState(false);
  const [isOrderSummaryModalOpen, setIsOrderSummaryModalOpen] = useState(false);
  const handleSelectMacModalOpen = useCallback(
    () => {
      setIsSelectMacModalOpen(true);
    },
    [],
  );

  const handleGiftOptionModalOpen = useCallback(
    () => {
      setIsGiftOptionModalOpen(true);
    },
    [],
  );

  const handleOrderSummaryModalOpen = useCallback(
    () => {
      setIsOrderSummaryModalOpen(true);
    },
    [],
  );

  const handleSelectMacModalClose = useCallback(
    () => setIsSelectMacModalOpen(false),
    [],
  );

  const handleGiftOptionModalClose = useCallback(
    () => setIsGiftOptionModalOpen(false),
    [],
  );

  const handleOrderSummaryModalClose = useCallback(
    () => setIsOrderSummaryModalOpen(false),
    [],
  );

  const proceedToSecondModal = useCallback(() => {
    setIsSelectMacModalOpen(false);
    setIsGiftOptionModalOpen(true);
  }, []);

  const recedeToFirstModal = useCallback(() => {
    setIsGiftOptionModalOpen(false);
    setIsSelectMacModalOpen(true);
  }, []);

  const proceedToThirdModal = useCallback(() => {
    setIsGiftOptionModalOpen(false);
    setIsOrderSummaryModalOpen(true);
  }, []);

  const recedeToSecondModal = useCallback(() => {
    setIsGiftOptionSelected(false);
    setIsOrderSummaryModalOpen(false);
    setIsGiftOptionModalOpen(true);
  }, [setIsGiftOptionSelected]);

  // console.log('isGifitOptSelcted: ', isGiftOptionSelected);

  const PackOrderModalContextValues = useMemo(
    () => ({
      isSelectMacModalOpen,
      handleSelectMacModalOpen,
      handleSelectMacModalClose,
      isGiftOptionModalOpen,
      handleGiftOptionModalOpen,
      handleGiftOptionModalClose,
      isOrderSummaryModalOpen,
      handleOrderSummaryModalOpen,
      handleOrderSummaryModalClose,
      closeSecondOpenThird: proceedToThirdModal,
    }),
    [
      isSelectMacModalOpen,
      handleSelectMacModalOpen,
      handleSelectMacModalClose,
      isGiftOptionModalOpen,
      handleGiftOptionModalOpen,
      handleGiftOptionModalClose,
      isOrderSummaryModalOpen,
      handleOrderSummaryModalOpen,
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
            // onClick={handleModalOneOpen}
            onClick={handleSelectMacModalOpen}
          >
            <img className="pack-thumbnail-image" src={image} alt={title} />
          </button>
          <SelectMacModal
            title={title}
            numMac={numMac}
            onNext={proceedToSecondModal}
          />
          <GiftOptionModal
            onPrevious={recedeToFirstModal}
            onNext={proceedToThirdModal}
          />
          <OrderPreviewModal
            title={title}
            onPrevious={recedeToSecondModal}
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
