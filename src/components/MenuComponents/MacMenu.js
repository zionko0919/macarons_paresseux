import { useContext } from 'react';
import OrderContext from '../../context/OrderContext';
import Thumbnail from './Thumbnail';
import { itemImages } from '../../items';
import './MacMenu.css';

function MacMenu() {
  const { macItems } = useContext(OrderContext);

  return (
    <div className="mac-menu-component">
      {macItems.map((item) => (
        <Thumbnail
          key={item.itemId}
          itemId={item.itemId}
          image={itemImages[item.imageId]}
          title={item.title}
        />
      ))}
    </div>
  );
}

export default MacMenu;
