import axios from 'axios';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import CurrentUserContext from '../context/CurrentUserContext';
import './UserDetails.css';

function UserDetails() {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout', {});
      setCurrentUser({});
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="user-details-component">
      { currentUser.username
        ? (
          <div>
            {currentUser.access === 'admin'
              ? <Link to="/orders">Dashboard</Link>
              : null}
            <p>{currentUser.username}</p>
            <button type="button" onClick={logout}>
              Log Out
            </button>
          </div>
        ) : <Link to="/login">Admin Sign-in</Link>}
    </div>
  );
}

export default UserDetails;
