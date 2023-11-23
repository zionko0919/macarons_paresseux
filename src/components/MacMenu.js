import { useContext } from 'react';
import OrderContext from '../context/OrderContext';
import Thumbnail from './Thumbnail';
import { itemImages } from '../items';
import './Menu.css';

function MacMenu() {
  const { macItems } = useContext(OrderContext);

  return (
    <div className="menu-component">
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
