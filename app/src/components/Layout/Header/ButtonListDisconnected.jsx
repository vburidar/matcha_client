import { useContext } from 'react';
import { Button } from '@material-ui/core';

import LinkButton from '../../LinkButton';
import { StoreContext } from '../../../store/Store';

function ButtonListDisconnected() {
  const { state } = useContext(StoreContext);

  if (state.inSession === false) {
    return (
      <div>
        <Button
          component={LinkButton}
          color="inherit"
          href="/signup"
        >
          Signup
        </Button>
        <Button
          component={LinkButton}
          color="inherit"
          href="/signin"
        >
          Signin
        </Button>
      </div>
    );
  }
  return (null);
}

export default ButtonListDisconnected;
