import { useEffect, useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Dialog from '@material-ui/core/Dialog';
import { StoreContext } from '../../store/Store';
import ProfilePic from '../../components/Profile/ProfilePic';
import ProfileInfos from '../../components/Profile/ProfileInfo';
import BlockDialog from '../../components/Profile/BlockDialog';
import { createApiRequester } from '../../api/Api';
import redirectTo from '../../initialServices/initialServices';

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

const profile = (props) => {
  const classes = useStyles();
  const [open] = useState(true);
  const { data, userId } = props;
  const { dispatch } = useContext(StoreContext);

  useEffect(() => {
    dispatch({ type: 'UPDATE_CONNECTION_STATUS', inSession: true, user_id: userId });
  }, []);

  if (data.visited_blocked_visitor || data.visitor_blocked_visited) {
    return (
      <Container maxWidth="xl" className={classes.container}>
        <BlockDialog props={data} />
      </Container>
    );
  }
  return (
    <Container maxWidth="xl" className={classes.container}>
      <Grid container spacing={3} className={classes.containerMain}>
        <Grid item xs={12} sm={9} md={5}>
          <ProfilePic props={data} />
        </Grid>
        <Grid item xs={12} sm={12} md={7} className={classes.container}>
          <ProfileInfos props={data} />
        </Grid>
      </Grid>
    </Container>
  );
};
profile.getInitialProps = async (ctx) => {
  const { req, res, query } = ctx;
  const apiObj = createApiRequester(req);
  const { data } = await apiObj.get('users/status');
  if (data.connected === false) {
    redirectTo('signin', req, res);
  }
  if (data.profileIsComplete === false) {
    redirectTo('/complete-profile', req, res);
  }
  const { url } = req;
  const code = url.split(/\//)[2];
  await apiObj.post('event/visits', { user_id: code });
  const user = await apiObj.get(`users/getProfileInfo/${code}`);
  return ({ data: user.data.rows[0], userId: data.user_id });
};

export default profile;
