import {
  useState, useEffect, useContext, useReducer,
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  Container,
  Paper,
  Grid,
  Box,
} from '@material-ui/core';

import { StoreContext } from '../store/Store';
import { createApiRequester } from '../stores/Api';

import ProfileCard from '../components/Homepage/ProfileCard';
import OptionPanel from '../components/Homepage/OptionPanel';
import ErrorComponent from '../components/ErrorComponent';
import redirectTo from '../initialServices/initialServices';

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
  paper: {
    margin: theme.spacing(2),
    textAlign: 'center',
  },
  noResultText: {
    textAlign: 'center',
    padding: theme.spacing(2),
  },
}));

function filtersReducer(state, action) {
  switch (action.type) {
    case 'initialise':
      return {
        age: action.age,
        distance: action.distance,
        popularity: action.popularity,
        commonInterests: action.commonInterests,
      };
    case 'setAge':
      return {
        ...state,
        age: action.age,
      };
    case 'setDistance':
      return {
        ...state,
        distance: action.distance,
      };
    case 'setPopularity':
      return {
        ...state,
        popularity: action.popularity,
      };
    case 'setCommonInterests':
      return {
        ...state,
        commonInterests: action.commonInterests,
      };
    default:
      return state;
  }
}

function usersReducer(state, action) {
  switch (action.type) {
    case 'relevance':
      return [].concat(state).sort((first, second) => second.score - first.score);
    case 'agedesc':
      return [].concat(state).sort((first, second) => second.age - first.age);
    case 'ageasc':
      return [].concat(state).sort((first, second) => first.age - second.age);
    case 'distance':
      return [].concat(state).sort((first, second) => first.distance - second.distance);
    case 'popularity':
      return [].concat(state).sort((first, second) => second.score_popularity - first.score_popularity);
    case 'commoninterests':
      return [].concat(state).sort(
        (first, second) => second.common_interests - first.common_interests,
      );
    default:
      return state;
  }
}

export default function HomePage({
  type, id, data, userId, status,
}) {
  const classes = useStyles();
  const { dispatch } = useContext(StoreContext);
  const [value, setValue] = useState(0);
  const [filters, dispatchFilters] = useReducer(filtersReducer, {
    age: [18, 80],
    distance: 100,
    popularity: [0, 1],
    commonInterests: 7,
  });
  const [users, dispatchUsers] = useReducer(usersReducer, data);
  const [listUsers, setListUsers] = useState({ data: [] });

  useEffect(() => {
    dispatch({ type: 'UPDATE_CONNECTION_STATUS', inSession: true, user_id: userId });
  }, []);

  if (type === 'error') {
    return (
      <div>
        <ErrorComponent message={id} status={400} />
      </div>
    );
  }
  return (
    <Container className={classes.mainContainer}>
      <div className={classes.paper}>
        <Typography variant="h4" color="textSecondary" component="h4">
          Welcome back! Here are some profiles we found just for you.
        </Typography>
      </div>
      <OptionPanel
        filters={filters}
        dispatchFilters={dispatchFilters}
        users={users}
        dispatchUsers={dispatchUsers}
        value={value}
        setValue={setValue}
        listUsers={listUsers}
        setListUsers={setListUsers}
      />
      { ((value === 1 && listUsers.data.length === 0)
        || (value === 0
          && users.filter(
            (user) => (user.age >= filters.age[0])
            && (user.age <= filters.age[1])
            && (Math.floor(user.distance) <= filters.distance)
            && (parseInt(user.score_popularity * 100, 10) >= filters.popularity[0])
            && (parseInt(user.score_popularity * 100, 10) <= filters.popularity[1])
            && (user.common_interests >= filters.commonInterests),
          ).length === 0
        ))
        && (
          <Grid container>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Typography className={classes.noResultText}>
                  We didn&apos;t find anyone matching your search
                  <br />
                  Open your mind and explore new horizons by extending your search
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        )}
      {
        value === 0
        && users
          .filter((user) => (user.age >= filters.age[0])
          && (user.age <= filters.age[1])
          && (Math.floor(user.distance) <= filters.distance)
          && (parseInt(user.score_popularity * 100, 10) >= filters.popularity[0])
          && (parseInt(user.score_popularity * 100, 10) <= filters.popularity[1])
          && (user.common_interests >= filters.commonInterests))
          .map((user) => (
            <ProfileCard
              profileData={user}
              key={user.user_id}
            />
          ))
      }
      {
        value === 1
        && listUsers.data
          .map((user) => (
            <ProfileCard
              profileData={user}
              userId={userId}
              key={user.user_id}
            />
          ))
      }
    </Container>
  );
}

HomePage.getInitialProps = async (ctx) => {
  const { req, res } = ctx;
  const apiObj = createApiRequester(req);
  try {
    const { data } = await apiObj.get('users/status');
    if (data.connected === false) {
      redirectTo('/signin', req, res);
      return ({ type: 'redirection', id: 'User is not connected' });
    }
    if (data.profileIsComplete === false) {
      redirectTo('/complete-profile', req, res);
      return ({ type: 'redirection', id: 'Profile is incomplete' });
    }
    const suggestionList = await apiObj.get('users/suggestions');
    return ({
      type: 'success', id: 'success', data: suggestionList.data.rows, userId: data.user_id, status: 200,
    });
  } catch (err) {
    return ({
      type: 'error',
      id: 'couldn\'t fetch suggestion list',
      userId: null,
    });
  }
};
