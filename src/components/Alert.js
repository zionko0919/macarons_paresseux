/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { Callout } from '@radix-ui/themes';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import './Alert.css';

const BACKGROUND_COLORS = {
  success: '#adc6a8',
  error: '#f5c6cb',
};

function Alert({
  children,
  visible,
  type,
}) {
  return (
    <div
      className={`alert-component ${visible && 'visible'}`}
      hidden={!visible}
    >
      <Callout.Root
        color={`${type === 'success' ? 'green' : 'red'}`}
        role="alert"
      >
        <Callout.Icon>
          <InfoCircledIcon />
        </Callout.Icon>
        <Callout.Text>
          {children}
        </Callout.Text>
      </Callout.Root>
    </div>
  );
}

Alert.propTypes = {
  children: PropTypes.node.isRequired,
  visible: PropTypes.bool.isRequired,
  type: PropTypes.oneOf(['success', 'error']).isRequired,
};

export default Alert;
