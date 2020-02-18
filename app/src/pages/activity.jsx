import router from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Button from '@material-ui/core/Button';
import {
  Avatar, Typography, Container, Paper, Box,
} from '@material-ui/core';
import { useEffect, useContext, useState } from 'react';
import Timetypo from '../components/Activity/TimeTypo';
import { StoreContext } from '../store/Store';
import { createApiRequester, IsSessionAuthOnPage } from '../api/Api';
import IconAction from '../components/Activity/IconAction';
import MessageTypo from '../components/Activity/MessageTypo';
import ListEvent from '../components/Activity/ListEvent';


const useStyles = makeStyles((theme) => ({
  image: {
  },

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

const ActivityPage = (props) => {
  const classes = useStyles();
  const { data, userId } = props;
  const { dispatch } = useContext(StoreContext);
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    console.log('in activity', data);
    dispatch({ type: 'UPDATE_CONNECTION_STATUS', inSession: true, user_id: userId });
  }, []);

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
    return ({ data: listEvent.data.rows, userId: ret.data.user_id });
  } catch (err) {
    console.log('error');
    return ({ type: 'error' });
  }
};

export default (ActivityPage);
