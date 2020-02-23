import router from 'next/router';
import { useContext } from 'react';
import { Button } from '@material-ui/core';

import { StoreContext } from '../../../store/Store';

function ButtonListDisconnected() {
  const { state } = useContext(StoreContext);

  if (state.inSession === false) {
    return (
      <div>
        <Button
          color="inherit"
          onClick={() => router.push('/signup')}
        >
          Signup
        </Button>
        <Button
          color="inherit"
          onClick={() => router.push('/signin')}
        >
          Signin
        </Button>
      </div>
    );
  }
  return (null);
}

export default ButtonListDisconnected;
