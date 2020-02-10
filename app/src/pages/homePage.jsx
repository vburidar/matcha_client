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
import SimpleSlider from '../components/simpleSlider';


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
}));

function HomePage() {
  const classes = useStyles();
  const { state, dispatch } = useContext(StoreContext);

  const obj = {
    image: '/profile-pic.jpg',
    surname: 'Jean-Philippe',
    name: 'Riche de la Moutardiere',
    localisation: 'Neuilly-sur-Seine',
    description: 'Je suis un enfant Je suis comme elle, pi brulez a trop vous frotter a mon caractere epice. J\'aime le bowling, les sorties tuning avec mon pote Dede, la deglingue et manger des conserves de haricots blancs. Je n\'aime pas les froufrous, mon voisin de palier (ce fdp qui mange tout avec du ketchup), la randonnee et les pulls a cols en V',
    interest: [
      'moutarde',
      'moutarde forte',
      'moutarde moins forte',
      'moutarde plus forte',
    ],
    genre: 'Male',
    birthdate: '28/07/1986',
    preference: [
      'women',
      'men',
      'non binary',
    ],
  };

  useEffect(() => {
    console.log('updating connection status');
    dispatch({ type: 'UPDATE_CONNECTION_STATUS', login: 'macheline', inSession: true });
  }, []);

  return (
    <Container className={classes.mainContainer}>
      <Typography color="textPrimary" variant="h6" component="h4">
                Our crafted selection of profile just for you to see!
      </Typography>
      <Card className={classes.card}>
        <Grid container className={classes.gridContainer}>
          <Grid className={classes.sliderContainer} item xs={11} sm={7} md={5} lg={5} xl={5}>
            <SimpleSlider />
          </Grid>
          <Grid className={classes.cardContent} item xs={12} sm={12} md={10} lg={6} xl={6}>
            <Typography className={classes.typo} color="textPrimary" variant="h4" component="h4">
              {obj.surname}
              {', '}
              27
            </Typography>
            <Container className={classes.container}>
              <Typography className={classes.typo} color="textSecondary" variant="h6" component="h4">
                {obj.description}
              </Typography>
            </Container>
            <Container>
              {obj.interest.map((label) => (
                <Chip
                  key={label}
                  size="small"
                  className={classes.chip}
                  label={label}
                  color="secondary"
                />
              ))}
            </Container>
            <Button className={classes.button} variant="contained" color="primary">
              See
              {' '}
              {obj.surname}
              's profile
            </Button>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
}
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
    console.log(suggestionList.data.rows);
    return ({ suggestionList: suggestionList.data.rows });
  } catch (err) {
    console.log('error: couldn\'t fetch suggestion list');
  }
  return ({ type: 'error', id: 'Unable to fetch suggestion list' });
};

export default HomePage;
