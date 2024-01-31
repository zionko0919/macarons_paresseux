/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import {
  Button, Container, Dialog, DialogContent, DialogTitle, FormControl, FormLabel,
  RadioGroup, Radio, Checkbox, FormControlLabel,
} from '@mui/material';

function ExchangeDialog({ isOpen, closeDialog, row }) {
  console.log(isOpen);
  return (
    <Dialog open={isOpen} onClose={closeDialog}>
      <DialogTitle>
        Exchange
        {row.name}
      </DialogTitle>
      <DialogContent>
        <Button type="button" onClick={closeDialog}>close</Button>
        <FormControl>
          <FormLabel>Exchange Type:</FormLabel>
          <RadioGroup>
            <FormControlLabel value="return" control={<Radio />} label="Return" />
            <FormControlLabel value="exchange" control={<Radio />} label="Exchange" />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogContent>
        <FormControl>
          <FormLabel>Reason Type:</FormLabel>
          <RadioGroup>
            <FormControlLabel value="incorrect order" control={<Checkbox />} label="incorrect order" />
            <FormControlLabel value="Poor quality" control={<Checkbox />} label="poor product quality/condition" />
            <FormControlLabel value="poor service" control={<Checkbox />} label="poor service" />
            <FormControlLabel value="unspecified" control={<Checkbox />} label="other" />
          </RadioGroup>
        </FormControl>
      </DialogContent>
    </Dialog>
  );
}

export default ExchangeDialog;
