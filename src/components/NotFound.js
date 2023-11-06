import { Link } from 'react-router-dom';
import GastonNotFound from '../images/gaston_notFound.png';
import './NotFound.css';

function NotFound() {
  return (
    <div className="not-found-component">
      <h2>Sorry</h2>
      <h3>we couldn&apos;t find that page</h3>
      <Link to="/">Return Home</Link>
      <img src={GastonNotFound} alt="Gaston Not Found" />

    </div>
  );
}

export default NotFound;
