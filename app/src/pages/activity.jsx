import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Avatar, Chip, Container, Paper } from '@material-ui/core';
import { useEffect, useContext } from 'react';
import { StoreContext } from '../store/Store';
import { createApiRequester, IsSessionAuthOnPage } from '../api/Api';
import SimpleSlider from '../components/Homepage/simpleSlider';
import ProfileCard from '../components/Homepage/ProfileCard';


const useStyles = makeStyles((theme) => ({
  image: {
  },

  paper:{
    display: 'flex',
    flexDirection: 'row',
    margin: theme.spacing(1),
  },

  avatar: {
    margin: theme.spacing(1),
  },

  typo: {
    margin: theme.spacing(1),
  },

  card: {

    margin: theme.spacing(3),
  },
  typo: {
    margin: theme.spacing(2),
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
    // display: 'flex',
    // textAlign: 'center',
    // flexDirection: 'column',
    // alignItems: 'center',
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
}));

const ActivityPage = (props) => {
  const classes = useStyles();
  const { data } = props;
  const { dispatch } = useContext(StoreContext);

  useEffect(() => {
    console.log(props);
    // dispatch({ type: 'UPDATE_CONNECTION_STATUS', inSession: true, user_id: userId });
  }, []);

  return (
    <Container>
      <Typography color="textPrimary" variant="h6" component="h4">
              Your recent activity
      </Typography>
      {data.map((element) => (
        <Paper className={classes.paper} key={element.created_at}>
          <Avatar className={classes.avatar} alt={element.first_name} src={element.path} />
          <Typography className={classes.typo} color="textPrimary" variant="h6" component="h4">
            {element.type} from {element.first_name} on {element.created_at}
          </Typography>
        </Paper>
      ))}
    </Container>
  );
};

ActivityPage.getInitialProps = async (ctx) => {
  const { req, res } = ctx;
  const apiObj = createApiRequester(req);
  const ret = await IsSessionAuthOnPage('private', apiObj);
  if (ret === false) {
    res.writeHead(302, {
      Location: '/signin',
    });
    res.end();
  }
  try {
    const listEvent = await apiObj.get('/event');
    return ({ data: listEvent.data.rows });
  } catch (err) {
    console.log('error');
    return ({ type: 'error' });
  }
};

export default (ActivityPage);
