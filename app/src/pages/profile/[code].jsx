import { useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { StoreContext } from '../../store/Store';
import ProfilePic from '../../components/Profile/ProfilePic';
import ProfileInfos from '../../components/Profile/ProfileInfo';
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
  const { state, dispatch } = useContext(StoreContext);

  useEffect(() => {
    dispatch({ type: 'UPDATE_CONNECTION_STATUS', login: props.first_name, inSession: true });
  }, []);

  return (
    <Container maxWidth="xl" className={classes.container}>
      <Grid container spacing={3} className={classes.containerMain}>
        <Grid item xs={12} sm={9} md={5}>
          <ProfilePic props={props} />
        </Grid>
        <Grid item xs={12} sm={12} md={7} className={classes.container}>
          <ProfileInfos props={props} />
        </Grid>
      </Grid>
    </Container>
  );
};

profile.getInitialProps = async (ctx) => {
  const { req, res } = ctx;
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
  const user = await apiObj.get(`users/getProfileInfo/${code}`);
  return (user.data.rows[0]);
};

export default profile;
