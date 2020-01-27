import { makeStyles } from '@material-ui/core/styles';
import { Container, Paper } from '@material-ui/core';
import Layout from '../components/Layout';

function HomePage() {
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

export default HomePage;
