import { makeStyles } from '@material-ui/core/styles';
import { Container, Paper } from '@material-ui/core';
import { useEffect, useContext } from 'react';
import Router from 'next/router';
import Layout from '../components/Layout';
import { StoreContext } from '../store/Store';

function myHomePage() {
  const { state } = useContext(StoreContext);

  useEffect(() => {
    console.log(state);
    if (state.inSession === false) {
      Router.push('/signin');
    }
  }, [state.inSession]);

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

export default myHomePage;
