import router from 'next/router';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import ButtonListConnected from './Header/ButtonListConnected';
import ButtonListDisconnected from './Header/ButtonListDisconnected';
import LinkButton from '../LinkButton';

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
}));

export default function Header() {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography component="div" className={classes.title}>
          <Button component={LinkButton} href="/" color="inherit">
            See You
          </Button>
        </Typography>
        <ButtonListConnected />
        <ButtonListDisconnected />
      </Toolbar>
    </AppBar>
  );
}
