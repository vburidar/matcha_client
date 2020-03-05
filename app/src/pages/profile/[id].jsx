import { useEffect, useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { StoreContext } from '../../store/Store';
import ProfilePic from '../../components/Profile/ProfilePic';
import ProfileInfos from '../../components/Profile/ProfileInfos';
import BlockDialog from '../../components/Profile/BlockDialog';
import { createApiRequester } from '../../stores/Api';
import redirectTo from '../../initialServices/initialServices';

import { SocketContext } from '../../stores/Socket';

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

export default function ProfilePage({ talker, userId }) {
  const classes = useStyles();
  const { dispatch } = useContext(StoreContext);
  const { socket, createVisit } = useContext(SocketContext);

  useEffect(() => {
    dispatch({ type: 'UPDATE_CONNECTION_STATUS', inSession: true, user_id: userId });
  }, []);

  useEffect(() => {
    if (Object.keys(socket).length > 0) {
      if (talker.id !== userId) {
        createVisit(talker.id);
      }
    }
  }, [socket]);

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
  const { data } = await apiObj.get('users/status');
  if (data.connected === false) {
    redirectTo('/signin', req, res);
  }
  if (data.profileIsComplete === false) {
    redirectTo('/complete-profile', req, res);
  }

  const { id } = query;
  try {
    const talkerQueryRes = await apiObj.get(`users/${id}`);
    const talker = talkerQueryRes.data.rows[0];
    return ({ talker, userId: data.user_id });
  } catch (err) {
    if (err.response.data === 'unauthorized') {
      return ({
        talker: {
          visited_blocked_visitor: true,
          visitor_blocked_visited: true,
          id,
        },
        userId: data.user_id,
      });
    }
    redirectTo('/404', req, res);
  }
};
