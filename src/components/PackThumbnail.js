/* eslint-disable no-unused-vars */
import {
  useCallback, useContext, useMemo, useState,
} from 'react';
import PropTypes from 'prop-types';
import OrderContext from '../context/OrderContext';
import PackOrderModalContext from '../context/PackOrderModalContext';
import PackOrderModalPageOne from './PackOrderModalPageOne';
import { PackMacListTypes } from '../reducers/packMacListReducer';
import './PackThumbnail.css';

function PackThumbnail({
  image, title, price, numMac,
}) {
  const { macListDispatch } = useContext(OrderContext);
  const [isModalOneOpen, setIsModalOneOpen] = useState(false);
  const handleModalOneOpen = () => {
    setIsModalOneOpen(true);
    // setIsModalOneOpen.log('Opening Pack Order Modal Page 1 for ', title);
  };

  // const handleModalOneClose = () => {
  //   setIsModalOneOpen(false);
  //   macListDispatch({ type: PackMacListTypes.EMPTY });
  //   // console.log('Closing from Pack Order Modal Page 1 for ', title);
  // };

  // const removeItemFromMacList = () => {
  //   macListDispatch({ type: PackMacListTypes.REMOVE, itemId: macList.itemId });
  // };

  // const handlModalOneCloseAfterAddToCart = () => {
  //   setIsModalOneOpen(false);
  // };

  const [isFirstModalOepn, setIsFirstModalOpen] = useState(false);
  const testFirstModal = () => {
    setIsFirstModalOpen(true);
    console.log('first Modal Open');
  };
  const handleFirstModalOpen = useCallback(
    () => testFirstModal,
    [],
  );
  const handleFirstModalClose = useCallback(
    () => setIsFirstModalOpen(false),
    [],
  );

  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const handleSecondModalOepn = useCallback(
    () => setIsSecondModalOpen(true),
    [],
  );
  const handleSecondModalClose = useCallback(
    () => setIsSecondModalOpen(false),
    [],
  );

  const [isThirdModalOpen, setIsThirdModalOepn] = useState(false);
  const handleThirdModalOpen = useCallback(
    () => setIsThirdModalOepn(true),
    [],
  );
  const handleThirdModalClose = useCallback(
    () => setIsThirdModalOepn(false),
    [],
  );

  const PackOrderModalContextValues = useMemo(
    () => ({
      isFirstModalOepn,
      handleFirstModalOpen,
      handleFirstModalClose,
      isSecondModalOpen,
      handleSecondModalOepn,
      handleSecondModalClose,
      isThirdModalOpen,
      handleThirdModalOpen,
      handleThirdModalClose,
    }),
    [
      isFirstModalOepn,
      handleFirstModalOpen,
      handleFirstModalClose,
      isSecondModalOpen,
      handleSecondModalOepn,
      handleSecondModalClose,
      isThirdModalOpen,
      handleThirdModalOpen,
      handleThirdModalClose,
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
            onClick={handleFirstModalOpen}
          >
            <img className="pack-thumbnail-image" src={image} alt={title} />
          </button>
          <PackOrderModalPageOne
          // isModalOneOpen={isModalOneOpen}
          // handleModalOneClose={handleModalOneClose}
          // handlModalOneCloseAfterAddToCart={handlModalOneCloseAfterAddToCart}
            numMac={numMac}
            packTitle={title}
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
