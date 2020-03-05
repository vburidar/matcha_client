import { useEffect, useState, useContext } from 'react';
import {
  Paper,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { formatDistance } from 'date-fns';

import { SocketContext } from '../../stores/Socket';
import SimpleSlider from '../Homepage/simpleSlider';

const useStyles = makeStyles((theme) => ({
  image: {
  },
  title: {
    color: 'black',
  },
  typo: {
    paddingBottom: theme.spacing(2),
  },
  maintext: {
    color: 'grey',
  },
  containerMain: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  chip: {
    margin: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    textAlign: 'center',
  },
  justifiedText: {
    textAlign: 'justify',
  },
  containerLef: {
    justifyContent: 'left',
  },
  buttonBottom: {
    margin: theme.spacing(1),
  },
  textField: {
    padding: theme.spacing(1),
  },
}));

function ProfilePic({ talker }) {
  const classes = useStyles();
  const {
    usersConnected,
    usersLastConnection,
  } = useContext(SocketContext);

  const [imageTab, setImageTab] = useState('');

  useEffect(() => {
    if (talker.list_images) {
      setImageTab(`${talker.path},${talker.list_images}`);
    } else {
      setImageTab(talker.path);
    }
  }, [talker.path]);

  useEffect(() => {
  }, [usersLastConnection]);

  return (
    <Paper className={classes.paper}>
      {usersConnected[talker.id] === true && (
        <Typography className={classes.typo} color="textSecondary" variant="h6" component="h4">
          Connected
        </Typography>
      )}
      {usersConnected[talker.id] !== true && usersLastConnection[talker.id] && (
        <Typography className={classes.typo} color="textSecondary" variant="h6" component="h4">
          Last connection :
          {' '}
          {formatDistance(
            usersLastConnection[talker.id],
            new Date(),
            { addSuffix: true },
          )}
        </Typography>
      )}
      {usersConnected[talker.id] !== true && !usersLastConnection[talker.id] && talker.last_time_online !== null && (
        <Typography className={classes.typo} color="textSecondary" variant="h6" component="h4">
          Last connection :
          {' '}
          {formatDistance(
            new Date(talker.last_time_online),
            new Date(),
            { addSuffix: true },
          )}
        </Typography>
      )}
      {usersConnected[talker.id] !== true && !usersLastConnection[talker.id] && talker.last_time_online === null && (
        <Typography className={classes.typo} color="textSecondary" variant="h6" component="h4">
          New user
        </Typography>
      )}
      <SimpleSlider imageList={imageTab} />
    </Paper>
  );
}

export default ProfilePic;
