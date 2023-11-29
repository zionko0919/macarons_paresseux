import { memo, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { itemImages } from '../../items';
import OrderContext from '../../context/OrderContext';
import Thumbnail from './Thumbnail';
import './MenuDetails.css';

function MenuDetails() {
  const { macItems } = useContext(OrderContext);

  return (
    <div className="menu-details-component">
      <Outlet />
      <div className="menu-details-component-sidebar">
        {macItems.map((item) => (
          <Thumbnail
            key={item.itemId}
            image={itemImages[item.imageId]}
            title={item.title}
            itemId={item.itemId}
          />
        ))}
      </div>
    </div>
  );
}

export default memo(MenuDetails);
