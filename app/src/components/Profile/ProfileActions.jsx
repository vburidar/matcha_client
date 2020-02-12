import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Chip, Button } from '@material-ui/core';
import { useEffect } from 'react';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    textAlign: 'center',
  },
}));

export default function ProfileAction({ props }) {
  const classes = useStyles();

  function likeProfile() {
    //console.log('you clicked on button');
  }

  if (props.visitor_liked === false && props.visited_liked === false) {
    return (
      <Paper className={classes.paper}>
        <Button variant="contained" color="primary" onClick={likeProfile}>
          {'Send a like to '}
          {props.first_name}
        </Button>
      </Paper>
    );
  } if (props.visitor_liked === true && props.visited_liked === false) {
    return (
      <Paper className={classes.paper}>
        <Typography color="textSecondary" variant="h6" component="h4">
          {'You liked '}
          {props.first_name}
          {'\'s profile. Hopefully, you will soon get an answer!'}
        </Typography>
        <Button variant="contained" color="primary" onClick={likeProfile}>
          Take your like back
        </Button>
      </Paper>
    );
  } if (props.visitor_liked === false && props.visited_liked === true) {
    return (
      <Paper className={classes.paper}>
        <Typography color="textSecondary" variant="h6" component="h4">
          {props.first_name}
          {' liked your profile. You are one click away of matching!'}
        </Typography>
        <Button variant="contained" color="primary" onClick={likeProfile}>
          MATCH !
        </Button>
      </Paper>
    );
  } if (props.visitor_liked === true && props.visited_liked === true) {
    return (
      <Paper className={classes.paper}>
        <Typography color="textSecondary" variant="h6" component="h4">
          {'You matched with '}
          {props.first_name}
          . Start chatting now!
        </Typography>
        <Button variant="contained" color="primary" onClick={likeProfile}>
          Go to Chat
        </Button>
      </Paper>
    );
  }
  return (null);
}
