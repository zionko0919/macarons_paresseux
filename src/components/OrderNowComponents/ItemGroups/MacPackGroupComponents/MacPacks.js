/* eslint-disable no-unused-vars */
import { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import OrderContext from '../../../../context/OrderContext';
import PackThumbnail from './PackThumbnail';
import { itemImages } from '../../../../items';
import '../Menu.css';

function MacPacks() {
  const { packItems } = useContext(OrderContext);

  return (
    <Routes>
      <Route
        path="/"
        element={(
          <div className="menu-component">
            {packItems.map((item) => (
              <PackThumbnail
                key={item.itemId}
                image={itemImages[item.imageId]}
                title={item.title}
                price={item.price}
                numMac={item.numMac}
              />
            ))}
          </div>
        )}
      />
    </Routes>

  );
}

export default MacPacks;
