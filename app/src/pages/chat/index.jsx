import Router from 'next/router';
import { useEffect, useContext } from 'react';
import {
  Container,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { createApiRequester } from '../../stores/Api';
import { StoreContext } from '../../store/Store';
import { SocketContext } from '../../stores/Socket';
import redirectTo from '../../initialServices/initialServices';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  online: {
    border: `solid 2px ${theme.palette.success.main}`,
  },
}));

function ChatPage({ users, userId }) {
  const classes = useStyles();
  const { usersConnected } = useContext(SocketContext);
  const { dispatch } = useContext(StoreContext);

  useEffect(() => {
    dispatch({ type: 'UPDATE_CONNECTION_STATUS', inSession: true, user_id: userId });
  }, []);

  return (
    <Container maxWidth="md" className={classes.container}>
      <Paper>
        <List>
          {users.map((user) => (
            <ListItem
              key={user.id}
              alignItems="flex-start"
              button
              onClick={() => Router.push('/chat/[id1]/[id2]', `/chat/${Math.min(user.id, userId)}/${Math.max(user.id, userId)}`)}
            >
              <ListItemAvatar>
                <Avatar
                  alt={user.firstName}
                  src={user.profilePicture}
                  // className={user.isOnline ? classes.online : ''}
                  className={usersConnected[user.id] === true ? classes.online : ''}
                />
              </ListItemAvatar>
              <ListItemText
                primary={user.firstName}
                secondary={(
                  <>
                    <Typography component="span" variant="body2">
                      {user.lastMessage.receiverId === user.id && (
                        <span>Vous: </span>
                      )}
                      {user.lastMessage.content}
                    </Typography>
                  </>
                )}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}
export default ChatPage;

ChatPage.getInitialProps = async ({ req, res }) => {
  const apiObj = createApiRequester(req);
  const { data } = await apiObj.get('users/status');
  if (data.connected === false) {
    redirectTo('/signin', req, res);
  }
  if (data.profileIsComplete === false) {
    redirectTo('/complete-profile', req, res);
  }

  const u = await apiObj.get('users/current/matches');
  const users = u.data;

  return { users, userId: data.user_id };
};
