import router from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Chip, Button } from '@material-ui/core';
import { useEffect, useContext } from 'react';
import { ApiContext } from '../../api/Api';
import { StoreContext } from '../../store/Store';

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

export default function ProfileAction({ props }) {
  const classes = useStyles();
  const { unlikeProfile, likeProfile } = useContext(ApiContext);
  const { state } = useContext(StoreContext);

  async function handleLikeProfile() {
    await likeProfile({
      user_id: props.id,
    });
    router.push(`/profile/${props.id}`);
  }

  async function handleUnlikeProfile() {
    await unlikeProfile({
      data: {
        user_id: props.id,
      },
    });
    router.push(`/profile/${props.id}`);
  }

  function handleGoToChat() {
    router.push('/chat');
  }

  if (props.id === state.user_id) {
    return (
      <Paper className={classes.paper}>
        <Typography color="textSecondary" variant="h6" component="h4">
          This is a preview of your profile to see how it looks to the others.
        </Typography>
        <Button className={classes.button} variant="contained" color="primary" onClick={handleUnlikeProfile}>
          Change your profile
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
        <Button className={classes.button} variant="contained" color="primary" onClick={handleGoToChat}>
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
