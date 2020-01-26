import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import theme from '../theme';
import { Provider } from '../store/Store';
import { StateProvider } from '../contextTest';

export default function App({ children }) {
  return (
    <>
      <Provider>
        <StateProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </StateProvider>
      </Provider>
    </>
  );
}
