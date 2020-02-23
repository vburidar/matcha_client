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
import Router, { useRouter } from 'next/router';

import { createApiRequester } from '../../stores/Api';
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
  const router = useRouter();
  const classes = useStyles();

  console.log(router);

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
                  className={user.isOnline ? classes.online : ''}
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
