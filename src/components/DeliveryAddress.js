/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { TextField, Button } from '@radix-ui/themes';

function DeliveryAddress() {
  return (
    <div>
      Address
      <TextField.Root>
        <TextField.Input placeholder="Address" />
      </TextField.Root>
      <TextField.Root>
        <TextField.Input placeholder="APT, suite, unit etc. (optional)" />
      </TextField.Root>
      <TextField.Root>
        <TextField.Input placeholder="City" />
      </TextField.Root>
      <TextField.Root>
        <TextField.Input placeholder="State" />
      </TextField.Root>
      <TextField.Root>
        <TextField.Input placeholder="ZIP" />
      </TextField.Root>

    </div>
  );
}

export default DeliveryAddress;
