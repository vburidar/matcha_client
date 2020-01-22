import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import theme from '../theme';
import { StoreProvider } from '../store/Store';

export default function App({ children }) {
  return (
    <>
      <StoreProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </StoreProvider>
    </>
  );
}
