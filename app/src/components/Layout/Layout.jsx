import { makeStyles } from '@material-ui/core/styles';

import App from '../App';
import Header from './Header';
import Footer from './Footer';
import Notifications from '../Notifications';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  main: {
    display: 'flex',
    flexGrow: 1,
  },
});

export default function Layout({ children }) {
  const classes = useStyles();

  return (
    <App>
      <div className={classes.root}>
        <Header />
        <main className={classes.main}>
          {children}
        </main>
        <Footer />
        <Notifications />
      </div>
    </App>
  );
}
