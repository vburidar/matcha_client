import { useEffect, useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Dialog from '@material-ui/core/Dialog';
import { StoreContext } from '../../store/Store';
import ProfilePic from '../../components/Profile/ProfilePic';
import ProfileInfos from '../../components/Profile/ProfileInfo';
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

const profile = ({ talker, userId }) => {
  const classes = useStyles();
  const { dispatch } = useContext(StoreContext);
  const { socket, createVisit } = useContext(SocketContext);

  useEffect(() => {
    dispatch({ type: 'UPDATE_CONNECTION_STATUS', inSession: true, user_id: userId });
  }, []);

  useEffect(() => {
    if (Object.keys(socket).length > 0) {
      if (talker.id !== userId) {
        console.log('NEW VISIT');
        // createVisit(talker.id);
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
          <ProfilePic props={talker} />
        </Grid>
        <Grid item xs={12} sm={12} md={7} className={classes.container}>
          <ProfileInfos props={talker} />
        </Grid>
      </Grid>
    </Container>
  );
};
profile.getInitialProps = async ({ req, res, query }) => {
  const apiObj = createApiRequester(req);
  const { data } = await apiObj.get('users/status');
  if (data.connected === false) {
    redirectTo('/signin', req, res);
  }
  if (data.profileIsComplete === false) {
    redirectTo('/complete-profile', req, res);
  }

  const { id } = query;
  const talkerQueryRes = await apiObj.get(`users/getProfileInfo/${id}`);
  const talker = talkerQueryRes.data.rows[0];
  return ({ talker, userId: data.user_id });
};

export default profile;
