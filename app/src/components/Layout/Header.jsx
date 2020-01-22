import { useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import {
  updateMessageWithSeverityAction,
} from '../../store/actions/notifications';

import { Store } from '../../store/Store';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Header() {
  const classes = useStyles();
  const { state, dispatch } = useContext(Store);

  useEffect(() => {
    const asyncUseEffect = async () => {
      setTimeout(() => {
        updateMessageWithSeverityAction(
          dispatch,
          { message: 'A 1st message', severity: 'info' },
        );
      }, 1000);

      setTimeout(() => {
        updateMessageWithSeverityAction(
          dispatch,
          { message: 'A 2nd message', severity: 'error' },
        );
      }, 10000);
    };
    asyncUseEffect();
  }, []);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          Match point
        </Typography>
        <Button color="inherit">Login</Button>
      </Toolbar>
    </AppBar>
  );
}
