import { Container, Tooltip, Typography } from '@material-ui/core';
import Stars from '@material-ui/icons/Stars';
import Navigation from '@material-ui/icons/Navigation';
import LocalMovies from '@material-ui/icons/LocalMovies';
import Height from '@material-ui/icons/Height';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  containerIcon: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: theme.spacing(1),
  },
}));

export default function ScoreIcons({
  scoreDistance, scorePopularity, scoreAge, scoreInterest, visitorId, userId,
}) {
  const classes = useStyles();

  if (visitorId === userId) {
    return (
      <Container className={classes.containerIcon}>
        <span className={classes.containerIcon}>
          <Stars className={classes.icon} />
          <Typography className={classes.typo}>
            {'  Your Popularity Score is of '}
            {parseInt(scorePopularity * 100, 10)}
            %
          </Typography>
        </span>
      </Container>
    );
  }
  if (scoreDistance !== undefined && scorePopularity !== undefined && scoreAge !== undefined && scoreInterest !== undefined) {
    return (
      <Container className={classes.containerIcon}>
        <Tooltip title="Localisation">
          <span className={classes.containerIcon}>
            <Navigation className={classes.icon} />
            <Typography>
              {parseInt(scoreDistance * 100, 10)}
              %
            </Typography>
          </span>
        </Tooltip>
        <Tooltip title="Popularity">
          <span className={classes.containerIcon}>
            <Stars className={classes.icon} />
            <Typography>
              {parseInt(scorePopularity * 100, 10)}
              %
            </Typography>
          </span>
        </Tooltip>
        <Tooltip title="Age proximity">
          <div className={classes.containerIcon}>
            <Height />
            <Typography>
              {parseInt(scoreAge * 100, 10)}
              %
            </Typography>
          </div>
        </Tooltip>
        <Tooltip title="Centers of interests">
          <div className={classes.containerIcon}>
            <LocalMovies />
            <Typography>
              {parseInt(scoreInterest * 100, 10)}
              %
            </Typography>
          </div>
        </Tooltip>
      </Container>
    );
  }
  return (<div />);
}
