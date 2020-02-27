import { useEffect, useContext, useState } from 'react';
import {
  Tab,
  AppBar,
  Tabs,
  Typography,
  Container,
  Box,
  Paper,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { StoreContext } from '../store/Store';
import { createApiRequester } from '../stores/Api';

import ListEvent from '../components/Activity/ListEvent';
import redirectTo from '../initialServices/initialServices';

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: theme.spacing(1),
  },

  avatar: {
    margin: theme.spacing(1),
  },

  typo: {
    margin: theme.spacing(1),
  },

  button: {
    display: 'flex',
    margin: theme.spacing(2),
    alignSelf: 'end',
  },
  icon: {
    margin: theme.spacing(2),
  },

  div: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  AppBar: {
    justifyContent: 'space-around',
    margin: theme.spacing(2),
  },

  tabs: {
    display: 'flex',
  },

  typoContainer: {
    textAlign: 'center',
  },
}));

function TabPanel(props) {
  const {
    children, value, index, ...other
  } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

export default function ActivityPage(props) {
  const classes = useStyles();
  const { data, userId } = props;
  const { dispatch } = useContext(StoreContext);
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    dispatch({ type: 'UPDATE_CONNECTION_STATUS', inSession: true, user_id: userId });
  }, []);


  if (data.length === 0) {
    return (
      <Container className={classes.typoContainer}>
        <Typography variant="h4" color="textSecondary" component="h4">
          {'You don\'t have any activity yet. Start interacting with other profiles!'}
        </Typography>
      </Container>
    );
  }
  return (
    <Container>
      <AppBar className={classes.AppBar} position="static">
        <Tabs centered value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="All events" />
          <Tab label="Matches" />
          <Tab label="Likes" />
          <Tab label="Visits" />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <ListEvent props={{ data, type: 'all' }} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ListEvent props={{ data, type: 'match' }} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ListEvent props={{ data, type: 'like' }} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <ListEvent props={{ data, type: 'visit' }} />
      </TabPanel>
    </Container>
  );
}

ActivityPage.getInitialProps = async ({ req, res }) => {
  const apiObj = createApiRequester(req);
  const { data } = await apiObj.get('users/status');
  if (data.connected === false) {
    redirectTo('/signin', req, res);
  }
  if (data.profileIsComplete === false) {
    redirectTo('/complete-profile', req, res);
  }
  try {
    const listEvent = await apiObj.get('/event');
    return ({ data: listEvent.data.rows, userId: data.user_id });
  } catch (err) {
    return ({ type: 'error' });
  }
};
