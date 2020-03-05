import { useEffect, useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { StoreContext } from '../../store/Store';
import ProfilePic from '../../components/Profile/ProfilePic';
import ProfileInfos from '../../components/Profile/ProfileInfos';
import BlockDialog from '../../components/Profile/BlockDialog';
import { createApiRequester } from '../../stores/Api';
import redirectTo from '../../initialServices/initialServices';

import { SocketContext } from '../../stores/Socket';
import ErrorComponent from '../../components/ErrorComponent';

const useStyles = makeStyles((theme) => ({
  containerMain: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    // justifyContent: 'center',
  },
}));

export default function ProfilePage({ type, talker, userId }) {
  const classes = useStyles();
  const { dispatch } = useContext(StoreContext);
  const { socket, createVisit } = useContext(SocketContext);

  useEffect(() => {
    if (type !== 'error' && type !== 'missing') {
      dispatch({ type: 'UPDATE_CONNECTION_STATUS', inSession: true, user_id: userId });
    }
  }, []);

  useEffect(() => {
    if (type !== 'error' && type !== 'missing') {
      if (Object.keys(socket).length > 0) {
        if (talker.id !== userId) {
          createVisit(talker.id);
        }
      }
    }
  }, [socket]);

  if (type === 'error') {
    return (<ErrorComponent status={400} message="couldn't fetch server data" />);
  }
  if (type === 'missing') {
    return (
      <Container className={classes.typoContainer}>
        <Typography variant="h4" color="textSecondary" component="h4">
          This user does not exist
        </Typography>
      </Container>
    );
  }
  if (talker.visited_blocked_visitor || talker.visitor_blocked_visited) {
    return (
      <Container maxWidth="xl" className={classes.container}>
        <BlockDialog props={talker} />
      </Container>
    );
  }
  return (
    <Container maxWidth="xl" className={classes.container}>
      <Grid container spacing={3} className={classes.containerMain}>
        <Grid item xs={12} sm={9} md={5}>
          <ProfilePic talker={talker} />
        </Grid>
        <Grid item xs={12} sm={12} md={7} className={classes.container}>
          <ProfileInfos props={talker} userId={userId} />
        </Grid>
      </Grid>
    </Container>
  );
}

ProfilePage.getInitialProps = async ({ req, res, query }) => {
  const apiObj = createApiRequester(req);
  const { id } = query;
  let data = null;
  try {
    const props = await apiObj.get('users/status');
    data = props.data;
  } catch (err) {
    return ({ type: 'error' });
  }
  if (data.connected === false) {
    redirectTo('/signin', req, res);
    return ({ type: 'redirection' });
  }
  if (data.profileIsComplete === false) {
    redirectTo('/complete-profile', req, res);
    return ({ type: 'redirection' });
  }
  try {
    const talkerQueryRes = await apiObj.get(`users/${id}`);
    const talker = talkerQueryRes.data.rows[0];
    if (talker === undefined) {
      return ({ type: 'missing' });
    }
    return ({ type: 'success', talker, userId: data.user_id });
  } catch (err) {
    if (err.response && err.response.data === 'unauthorized') {
      return ({
        type: 'blocked',
        talker: {
          visited_blocked_visitor: true,
          visitor_blocked_visited: true,
          id,
        },
        userId: data.user_id,
      });
    }
    return ({ type: 'error' });
  }
};
