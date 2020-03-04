import { makeStyles } from '@material-ui/core/styles';
import router from 'next/router';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Chip, Container } from '@material-ui/core';
import { useEffect, useState } from 'react';
import SimpleSlider from './simpleSlider';
import ScoreIcons from './ScoreIcons';
import LinkButton from '../LinkButton';


const useStyles = makeStyles((theme) => ({
  image: {
  },
  card: {
    margin: theme.spacing(3, 0),
  },
  typo: {
    marginBottom: theme.spacing(2),
  },
  container: {
    textAlign: 'justify',
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  mainContainer: {
    display: 'flex',
    textAlign: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  gridContainer: {
    display: 'flex',
    textAlign: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  chip: {
    margin: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(2),
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

export default function ProfileCard(
  { profileData, userId },
) {
  const classes = useStyles();
  const [imageTab, setImageTab] = useState('');
  useEffect(() => {
    if (profileData.list_images) {
      setImageTab(`${profileData.path},${profileData.list_images}`);
    } else {
      setImageTab(profileData.path);
    }
  }, []);

  return (
    <Card className={classes.card}>
      <Grid container className={classes.gridContainer}>
        <Grid className={classes.sliderContainer} item xs={11} sm={7} md={5} lg={5} xl={5}>
          <SimpleSlider imageList={imageTab} />
        </Grid>
        <Grid className={classes.cardContent} item xs={12} sm={12} md={10} lg={6} xl={6}>
          <Typography color="textPrimary" variant="h4" component="h4">
            {profileData.first_name}
            {', '}
            {profileData.age}
          </Typography>
          <Typography className={classes.typo} color="textSecondary" variant="h6" component="h4">
            {Math.floor(profileData.distance)}
            {' km away'}
          </Typography>
          <ScoreIcons
            scorePopularity={profileData.score_popularity}
            scoreDistance={profileData.score_distance}
            scoreAge={profileData.score_age}
            scoreInterest={profileData.score_interest}
            visitorId={profileData.user_id}
            userId={userId}
          />
          <Container className={classes.container}>
            <Typography className={classes.typo} color="textSecondary" variant="h6" component="h4">
              {profileData.description}
            </Typography>
          </Container>
          <Container>
            {profileData.list_interests
              && profileData.list_interests.split(',').map((label) => (
                <Chip
                  key={label}
                  size="small"
                  className={classes.chip}
                  label={label
                    .replace(/^[a-z]|\.[a-z]|-[a-z]|_[a-z]|'[a-z]/g, (el) => el.toUpperCase())
                    .replace(/_/g, ' ')}
                  color="secondary"
                />
              ))}
            {profileData.list_all_interests.split(',').map((label) => (
              <Chip
                key={label}
                size="small"
                className={classes.chip}
                label={label
                  .replace(/^[a-z]|\.[a-z]|-[a-z]|_[a-z]|'[a-z]/g, (el) => el.toUpperCase())
                  .replace(/_/g, ' ')}
              />
            ))}
          </Container>
          <Button component={LinkButton} href="/profile/[id]" hrefAs={`/profile/${profileData.user_id}`} className={classes.button} variant="contained" color="primary">
            See
            {' '}
            {profileData.first_name}
            &apos;s profile
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
}
