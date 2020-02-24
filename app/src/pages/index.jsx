import { useEffect, useContext, useReducer } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  Container,
  Paper,
} from '@material-ui/core';

import { StoreContext } from '../store/Store';
import { createApiRequester } from '../stores/Api';

import ProfileCard from '../components/Homepage/ProfileCard';
import FiltersAndOrders from '../components/Homepage/FiltersAndOrders';
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
      return [].concat(state).sort((first, second) => first.score < second.score);
    case 'agedesc':
      return [].concat(state).sort((first, second) => first.age < second.age);
    case 'ageasc':
      return [].concat(state).sort((first, second) => first.age > second.age);
    case 'distance':
      return [].concat(state).sort((first, second) => first.distance > second.distance);
    case 'popularity':
      return [].concat(state).sort((first, second) => first.score_popularity < second.score_popularity);
    case 'commoninterests':
      return [].concat(state).sort(
        (first, second) => first.common_interests < second.common_interests,
      );
    default:
      return state;
  }
}

const HomePage = ({ data, userId }) => {
  const classes = useStyles();
  const { dispatch } = useContext(StoreContext);
  const [filters, dispatchFilters] = useReducer(filtersReducer, {
    age: [18, 80],
    distance: 100,
    popularity: [0, 1],
    commonInterests: 7,
  });
  const [users, dispatchUsers] = useReducer(usersReducer, data);

  useEffect(() => {
    dispatch({ type: 'UPDATE_CONNECTION_STATUS', inSession: true, user_id: userId });
  }, []);

  return (
    <Container className={classes.mainContainer}>
      <div className={classes.paper}>
        <Typography variant="h4" color="TextSecondary">
          Welcome back! Here are some profiles we found just for you.
        </Typography>
      </div>
      <FiltersAndOrders
        filters={filters}
        dispatchFilters={dispatchFilters}
        users={users}
        dispatchUsers={dispatchUsers}
      />
      {users
        .filter((user) => (user.age >= filters.age[0])
          && (user.age <= filters.age[1])
          && (Math.floor(user.distance) <= filters.distance)
          && (parseInt(user.score_popularity * 100, 10) >= filters.popularity[0])
          && (parseInt(user.score_popularity * 100, 10) <= filters.popularity[1])
          && (user.common_interests >= filters.commonInterests))
        .map((user) => (
          <ProfileCard
            profileData={user}
            key={user.id}
          />
        ))}
    </Container>
  );
};
HomePage.getInitialProps = async (ctx) => {
  const { req, res } = ctx;
  const apiObj = createApiRequester(req);
  const { data } = await apiObj.get('users/status');
  if (data.connected === false) {
    redirectTo('/signin', req, res);
  }
  if (data.profileIsComplete === false) {
    redirectTo('/complete-profile', req, res);
  }
  try {
    const suggestionList = await apiObj.get('users/getSuggestionList');
    return { data: suggestionList.data.rows, userId: data.user_id };
  } catch (err) {
    console.log('error: couldn\'t fetch suggestion list');
  }
  return ({ type: 'error', id: 'Unable to fetch suggestion list' });
};

export default HomePage;
