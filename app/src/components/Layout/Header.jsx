import { makeStyles } from '@material-ui/core/styles';
import router from 'next/router';
import {
  Button,
  AppBar,
  Toolbar,
  Typography,
} from '@material-ui/core';
import ButtonListConnected from '../Header/ButtonListConnected';
import ButtonListDisconnected from '../Header/ButtonListDisconnected';


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
        <Typography variant="h6" className={classes.title}>
          Match point
        </Typography>
        <ButtonListConnected />
        <ButtonListDisconnected />
      </Toolbar>
    </AppBar>
  );
}
