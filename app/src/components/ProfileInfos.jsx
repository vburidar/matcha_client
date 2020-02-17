import { makeStyles } from '@material-ui/core/styles';
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

function ProfileInfos({ props }) {
  const classes = useStyles();

  const handleDelete = () => {
    console.info('You clicked on the delete icon');
  };

  return (
    <div>
      <Paper className={classes.paper}>
        <Typography color="textSecondary" variant="h6" component="h4">
                Your name
        </Typography>
        <Typography variant="h4" component="h4">
          {props.surname}
          {' '}
          {props.name}
        </Typography>
        <Typography color="textSecondary" variant="h6" component="h4">
                Your age
        </Typography>
        <Typography variant="h5" component="h4">
              27 years old
        </Typography>
      </Paper>
      <Paper className={classes.paper}>
        <Typography color="textSecondary" variant="h6" component="h4">
                Your current localisation
        </Typography>
        <Typography variant="h5" component="h4">
          {props.localisation}
        </Typography>
        <Button className={classes.buttonBottom} color="secondary" variant="contained">
            CHANGE
        </Button>
      </Paper>
      <Paper className={classes.paper}>
        <Typography color="textSecondary" variant="h6" component="h4">
            Your genre
        </Typography>
        <Typography color="textPrimary" variant="h6" component="h4">
          {props.genre}
        </Typography>
        <Typography color="textSecondary" variant="h6" component="h4">
            Your preferences
        </Typography>
        <Chip onDelete={handleDelete} className={classes.chip} label={props.preference[0]} />
        <Chip onDelete={handleDelete} className={classes.chip} label={props.preference[1]} />
        <Chip onDelete={handleDelete} className={classes.chip} label={props.preference[2]} />
        <Button color="secondary" variant="contained">
            CHOOSE
        </Button>
      </Paper>
      <Paper className={classes.paper}>
        <Typography color="textSecondary" variant="h6" component="h4">
            Your description
        </Typography>
        <Typography className={classes.justifiedText} color="textPrimary" variant="h6" component="h4">
          {props.description}
        </Typography>
        <Button className={classes.buttonBottom} color="secondary" variant="contained">
              CHANGE
        </Button>
      </Paper>
      <Paper className={classes.paper}>
        <Typography color="textSecondary" variant="h6" component="h4">
            Your centers of interest
        </Typography>
        <Container className={classes.containerLeft}>
          <TextField className={classes.textField} />
          <Button className={classes.buttonBottom} color="secondary" variant="contained">
            ADD
          </Button>
        </Container>
        {props.interest.map((label) => (
          <Chip
            key={label}
            size="small"
            className={classes.chip}
            label={label}
            onDelete={handleDelete(label)}
            color="secondary"
          />
        ))}
      </Paper>
    </div>
  );
}

export default ProfileInfos;
