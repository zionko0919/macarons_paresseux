import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-component">
      #Event Game
      {/* Game Event */}
      <Link to="/all_menu">
        <button type="button">ALL MENU</button>
      </Link>
      <Link to="/ordernow">
        <button type="button">ORDER NOW</button>
      </Link>
    </div>
  );
}

export default Home;
