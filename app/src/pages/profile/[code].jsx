import { useEffect, useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Dialog from '@material-ui/core/Dialog';
import { StoreContext } from '../../store/Store';
import ProfilePic from '../../components/Profile/ProfilePic';
import ProfileInfos from '../../components/Profile/ProfileInfo';
import BlockDialog from '../../components/Profile/BlockDialog';
import { createApiRequester, IsSessionAuthOnPage } from '../../api/Api';

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
  const ret = await IsSessionAuthOnPage('private', apiObj);
  if (ret === false) {
    res.writeHead(302, {
      Location: '/signin',
    });
    res.end();
  }
  const { url } = req;
  const code = url.split(/\//)[2];
  console.log('code', code);
  const visit = await apiObj.post('event/visits', { user_id: code });
  const user = await apiObj.get(`users/getProfileInfo/${code}`);
  return ({ data: user.data.rows[0], userId: ret.data.user_id });
};

export default profile;
