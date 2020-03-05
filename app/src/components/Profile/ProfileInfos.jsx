import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Chip,
  Paper,
  Typography,
  Tooltip,
  Container,
} from '@material-ui/core';
import Stars from '@material-ui/icons/Stars';
import Navigation from '@material-ui/icons/Navigation';
import LocalMovies from '@material-ui/icons/LocalMovies';
import Height from '@material-ui/icons/Height';

import ProfileActions from './ProfileActions';
import ReportDialog from './reportDialog';
import ScoreIcons from '../Homepage/ScoreIcons';

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
  sliderContainer: {
    display: 'flex',
    textAlign: 'center',
    flexDirection: 'column',
    margin: theme.spacing(2),
  },
  containerIcon: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: theme.spacing(2),
  },
}));

function ProfileInfos({ props, userId }) {
  const classes = useStyles();

  function computeGender(val) {
    if (val === 1) {
      return ('Man');
    } if (val === 2) {
      return ('Woman');
    } if (val === 4) {
      return ('Gender Queer');
    }
    return ('Gender Fluid');
  }

  function computeSexualPreference(val) {
    let ret = '';
    if (val & 1) {
      ret += 'Man';
    } if (val & 2) {
      if (ret.length > 0) {
        ret += ', ';
      }
      ret += 'Woman';
    } if (val & 4) {
      if (ret.length > 0) {
        ret += ', ';
      }
      ret += 'Gender Queer';
    } if (val & 8) {
      if (ret.length > 0) {
        ret += ', ';
      }
      ret += 'Gender Fluid';
    }
    return (ret);
  }

  return (
    <div>
      <Paper className={classes.paper}>
        {userId !== props.id && (
          <ReportDialog props={props} />
        )}
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
        {props.id !== userId
        && (
        <Typography color="textSecondary" variant="h5" component="h4">
          {Math.floor(props.distance)}
          {' kilometers away'}
        </Typography>
        )}
        <ScoreIcons
          scoreDistance={props.score_distance}
          scorePopularity={props.popularity_score / 100}
          scoreAge={props.score_age}
          scoreInterest={props.score_interest}
          userId={userId}
          visitorId={props.id}
        />
      </Paper>
      <Paper className={classes.paper}>
        <Typography color="textSecondary" variant="h6" component="h4">
          {'Gender: '}
          {computeGender(props.gender)}
        </Typography>
        <Typography color="textSecondary" variant="h6" component="h4">
          {'Sexual preference: '}
          {computeSexualPreference(props.sexual_preference)}
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
            label={element
              .replace(/^[a-z]|\.[a-z]|-[a-z]|_[a-z]|'[a-z]/g, (el) => el.toUpperCase())
              .replace(/_/g, ' ')}
            color="secondary"
          />
        ))}
      </Paper>
      <ProfileActions props={props} userId={userId} />
    </div>
  );
}

export default ProfileInfos;
