import { useContext } from 'react';
import OrderContext from '../../../../context/OrderContext';
import DrinkThumbnail from './DrinkThumbnail';
import { itemImages } from '../../../../items';
import '../Menu.css';

function DrinkMenu() {
  const { drinkItems } = useContext(OrderContext);

  return (
    <div className="menu-component">
      {drinkItems.map((item) => (
        <DrinkThumbnail
          key={item.itemId}
          drinkImage={itemImages[item.imageId]}
          drinkTitle={item.title}
          drinkPrice={item.price}
          drinkDescription={item.description}
          drinkCalories={item.calories}
          drinkSize={item.size}
        />
      ))}
    </div>
  );
}

export default DrinkMenu;
