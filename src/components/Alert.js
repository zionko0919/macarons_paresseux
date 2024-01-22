/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { Alert as AlertMUI, Container, Box } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';
import './Alert.css';

function Alert({ children, visible, type }) {
  const getSeverity = (alertType) => { // Rename 'type' to 'alertType'
    if (alertType === 'success') return 'success';
    if (alertType === 'warning') return 'warning';
    return 'error';
  };

  return (
    <Container>
      <Box
        className={`alert-component ${visible ? 'visible' : ''}`}
        hidden={!visible}
      >
        <AlertMUI
          variant="filled"
          icon={<InfoOutlined fontSize="inherit" />}
          severity={getSeverity(type)}
        >
          {children}
        </AlertMUI>
      </Box>
    </Container>
  );
}

Alert.propTypes = {
  children: PropTypes.node.isRequired,
  visible: PropTypes.bool.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning']).isRequired,
};

export default Alert;
