import { makeStyles } from '@material-ui/core/styles';
import { useEffect, useState } from 'react';
import CardMedia from '@material-ui/core/CardMedia';
import Card from '@material-ui/core/Card';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Chip } from '@material-ui/core';
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

function ProfilePic({ props }) {
  const classes = useStyles();
  const [imageTab, setImageTab] = useState('');

  useEffect(() => {
    if (props.list_images) {
      setImageTab(`${props.path},${props.list_images}`);
    } else {
      setImageTab(props.path);
    }
  }, []);

  const handleChangePic = () => {
    console.log('you clicked on the button to change the profile pic');
  };

  return (
    <Paper className={classes.paper}>
      <Typography className={classes.typo} color="textSecondary" variant="h6" component="h4">
                Picture
      </Typography>
      <SimpleSlider imageList={imageTab} />
    </Paper>
  );
}

export default ProfilePic;
