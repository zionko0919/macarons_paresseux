/* eslint-disable no-unused-vars */
import axios from 'axios';
import {
  useEffect, useState, useContext, useMemo, Fragment, useCallback,
} from 'react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Paper,
  Checkbox,
  Typography,
  Collapse,
  Box,
  TextField,
  Container,
  TablePagination,
  IconButton,
  ButtonGroup,
} from '@mui/material';
import {
  DeleteRounded, CheckCircleRounded, SentimentDissatisfied, Info, Check,
  SentimentSatisfiedAlt, ArrowUpward, ArrowDownward, SortRounded, Close,
} from '@mui/icons-material';
import OrderContext from '../context/OrderContext';
import { useCurrentUserContext } from '../context/CurrentUserContext';
import DashboardContext from '../context/DashboardContext';
import OrdersTableEntryInfo from './OrdersTableDetail';

function OperationManagement() {
  return (
    <div>
      <Typography variant="h3">
        #Operation Management
      </Typography>
    </div>
  );
}

export default OperationManagement;
