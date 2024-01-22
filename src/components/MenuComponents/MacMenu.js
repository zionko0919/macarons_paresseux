/* eslint-disable no-unused-vars */
import { useContext } from 'react';
import {
  Card, CardActionArea, CardContent, CardMedia, Container, Typography,
} from '@mui/material';
import OrderContext from '../../context/OrderContext';
import Thumbnail from './Thumbnail';
import { itemImages } from '../../items';
import './MacMenu.css';

function MacMenu() {
  const { macItems } = useContext(OrderContext);

  return (
    <Container>
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
    </Container>
  );
}

export default MacMenu;
