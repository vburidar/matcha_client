import router from 'next/router';
import { Button } from '@material-ui/core';
import { useContext, useEffect } from 'react';
import { StoreContext } from '../../store/Store';
import { ApiContext } from '../../api/Api';

function ButtonListConnected() {
  const { state, dispatch } = useContext(StoreContext);
  const { sessionDelete } = useContext(ApiContext);

  async function handleLogout() {
    try {
      await sessionDelete();
      dispatch({ type: 'UPDATE_CONNECTION_STATUS', inSession: false });
    } catch (err) {
      console.log('error');
    }
    router.push('/signin');
  }

  async function handleMyProfile() {
    //console.log('handleMyProfile', state);
    router.push(`/profile/${state.user_id}`);
  }

  useEffect(() => {
  }, [state.inSession]);
  if (state.inSession === true) {
    return (
      <div>
        <Button color="inherit" onClick={handleMyProfile}>MyProfile</Button>
        <Button color="inherit">Chat</Button>
        <Button color="inherit">Activity</Button>
        <Button color="inherit" onClick={handleLogout}>Logout</Button>
      </div>
    );
  }
  return (null);
}


export default ButtonListConnected;
