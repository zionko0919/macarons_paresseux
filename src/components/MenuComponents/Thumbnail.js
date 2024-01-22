import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Card, CardActionArea, CardMedia, CardContent, Typography,
} from '@mui/material';
import './Thumbnail.css';

function Thumbnail({
  itemId, image, title,
}) {
  return (
    <Link
      className="thumbnail-component"
      to={`/all_menu/details/${itemId}`}
      style={{ textDecoration: 'none' }} // Remove underline from the link
    >
      <Card>
        <CardActionArea>
          <CardMedia
            component="img"
            image={image}
            alt={title}
          />
          <CardContent>
            <Typography
              gutterBottom
              variant="h6"
              color="black"
              sx={{ textAlign: 'center', fontFamily: 'pacifico' }}
            >
              {title}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
}

Thumbnail.propTypes = {
  itemId: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default Thumbnail;
