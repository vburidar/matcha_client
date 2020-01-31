import { useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Paper } from '@material-ui/core';
import Layout from '../components/Layout';
import { StoreContext } from '../store/Store';
import { createApiRequester, IsSessionAuthOnPage } from '../api/Api';

function HomePage() {
  const { state, dispatch } = useContext(StoreContext);

  useEffect(() => {
    console.log('updating connection status');
    dispatch({ type: 'UPDATE_CONNECTION_STATUS', login: 'macheline', inSession: true });
  }, []);

  return (
    <Container>
      <Paper>
        <div>
          <h1>You are connected</h1>
        </div>
      </Paper>
    </Container>
  );
}
HomePage.getInitialProps = async (ctx) => {
  const { req, res } = ctx;
  const apiObj = createApiRequester(req);
  const ret = await IsSessionAuthOnPage('private', apiObj);
  if (ret === false) {
    res.writeHead(302, {
      Location: '/signin',
    });
    res.end();
  }
  return (ret.data);
};

export default HomePage;
