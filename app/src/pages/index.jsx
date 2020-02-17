import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Chip, Container, Paper } from '@material-ui/core';
import { useEffect, useContext } from 'react';
import { StoreContext } from '../store/Store';
import { createApiRequester, IsSessionAuthOnPage } from '../api/Api';
import SimpleSlider from '../components/Homepage/simpleSlider';
import ProfileCard from '../components/Homepage/ProfileCard';


const useStyles = makeStyles((theme) => ({
  image: {
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
    //display: 'flex',
    //textAlign: 'center',
    //flexDirection: 'column',
    //alignItems: 'center',
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

const HomePage = (props) => {
  const classes = useStyles();
  const { state, dispatch } = useContext(StoreContext);
  const { data, userId } = props;

  useEffect(() => {
    dispatch({ type: 'UPDATE_CONNECTION_STATUS', inSession: true, user_id: userId });
  }, []);

  return (
    <Container className={classes.mainContainer}>
      <Typography color="textPrimary" variant="h6" component="h4">
                Our crafted selection of profile just for you to see!
      </Typography>
      {data.map((element) => (
        <ProfileCard
          profileData={element}
          key={element.user_id}
        />
      ))}
    </Container>
  );
};
HomePage.getInitialProps = async (ctx) => {
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
    const suggestionList = await apiObj.get('users/getSuggestionList');
    //console.log(suggestionList.data.rows);
    console.log('data=', ret.data);
    return { data: suggestionList.data.rows, userId: ret.data.user_id };
  } catch (err) {
    console.log('error: couldn\'t fetch suggestion list');
  }
  return ({ type: 'error', id: 'Unable to fetch suggestion list' });
};

export default HomePage;
