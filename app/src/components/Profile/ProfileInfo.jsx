import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {
  Chip, IconButton, Menu, MenuItem,
} from '@material-ui/core';
import ProfileActions from './ProfileActions';
import ReportDialog from './reportDialog';

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
    position: 'relative',
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
  reportMenu: {
    position: 'absolute',
    top: '10px',
    left: '10px',
  },
}));

function ProfileInfos({ props }) {
  const classes = useStyles();

  return (
    <div>
      <Paper className={classes.paper}>
        <ReportDialog props={props} />
        <Typography variant="h4" component="h4">
          {props.first_name}
          {' '}
          {props.last_name}
        </Typography>
        <Typography variant="h5" component="h4">
          {props.age}
          {' '}
          {' years old'}
        </Typography>
        <Typography color="textSecondary" variant="h5" component="h4">
          {Math.floor(props.distance)}
          {' kilometers away'}
        </Typography>
      </Paper>
      <Paper className={classes.paper}>
        <Typography color="textSecondary" variant="h6" component="h4">
            Description
        </Typography>
        <Typography className={classes.justifiedText} color="textPrimary" variant="h6" component="h4">
          {props.description}
        </Typography>
      </Paper>
      <Paper className={classes.paper}>
        <Typography color="textSecondary" variant="h6" component="h4">
            Centers of interest
        </Typography>
        {props.list_interests.split(',').map((element) => (
          <Chip
            key={element}
            size="small"
            className={classes.chip}
            label={element}
            color="secondary"
          />
        ))}
      </Paper>
      <ProfileActions props={props} />
    </div>
  );
}

export default ProfileInfos;
