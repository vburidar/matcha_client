import router from 'next/router';
import { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Paper,
  Typography,
} from '@material-ui/core';

import { StoreContext } from '../../store/Store';
import { SocketContext } from '../../stores/Socket';
import LinkButton from '../LinkButton';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    textAlign: 'center',
  },
  button: {
    margin: theme.spacing(1),
  },
}));

export default function ProfileAction({ props, userId }) {
  const classes = useStyles();
  const { state } = useContext(StoreContext);
  const { createLike, deleteLike } = useContext(SocketContext);

  async function handleLikeProfile() {
    createLike(props.id);
    router.push('/profile/[id]', `/profile/${props.id}`);
  }

  async function handleUnlikeProfile() {
    deleteLike(props.id);
    router.push('/profile/[id]', `/profile/${props.id}`);
  }

  if (props.id === state.user_id) {
    return (
      <Paper className={classes.paper}>
        <Typography color="textSecondary" variant="h6" component="h4">
          This is a preview of your profile to see how it looks to the others.
        </Typography>
        <Button
          component={LinkButton}
          className={classes.button}
          variant="contained"
          color="primary"
          href="/profile/settings"
        >
          Settings
        </Button>
      </Paper>
    );
  }
  if (props.visitor_liked_visited === false && props.visited_liked_visitor === false) {
    return (
      <Paper className={classes.paper}>
        <Button className={classes.button} variant="contained" color="primary" onClick={handleLikeProfile}>
          {'Send a like to '}
          {props.first_name}
        </Button>
      </Paper>
    );
  } if (props.visitor_liked_visited === true && props.visited_liked_visitor === false) {
    return (
      <Paper className={classes.paper}>
        <Typography color="textSecondary" variant="h6" component="h4">
          {'You liked '}
          {props.first_name}
          {'\'s profile. Hopefully, you will soon get an answer!'}
        </Typography>
        <Button className={classes.button} variant="contained" color="primary" onClick={handleUnlikeProfile}>
          Take your like back
        </Button>
      </Paper>
    );
  } if (props.visitor_liked_visited === false && props.visited_liked_visitor === true) {
    return (
      <Paper className={classes.paper}>
        <Typography color="textSecondary" variant="h6" component="h4">
          {props.first_name}
          {' liked your profile. You are one click away of matching!'}
        </Typography>
        <Button className={classes.button} variant="contained" color="primary" onClick={handleLikeProfile}>
          MATCH !
        </Button>
      </Paper>
    );
  } if (props.visitor_liked_visited === true && props.visited_liked_visitor === true) {
    return (
      <Paper className={classes.paper}>
        <Typography color="textSecondary" variant="h6" component="h4">
          {'You matched with '}
          {props.first_name}
          . Start chatting now!
        </Typography>
        <Button
          component={LinkButton}
          className={classes.button}
          variant="contained"
          color="primary"
          href="/chat/[id1]/[id2]"
          hrefAs={`/chat/${Math.min(props.id, userId)}/${Math.max(props.id, userId)}`}
        >
          Go to Chat
        </Button>
        <Button className={classes.button} variant="outlined" color="primary" onClick={handleUnlikeProfile}>
          Take your like back
        </Button>
      </Paper>
    );
  }
  return (null);
}
