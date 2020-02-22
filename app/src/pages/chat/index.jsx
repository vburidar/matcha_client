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
import Router from 'next/router';

import { createApiRequester, IsSessionAuthOnPage } from '../../api/Api';

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

  return (
    <Container maxWidth="md" className={classes.container}>
      <Paper>
        <List>
          {users.map((user) => (
            <ListItem
              key={user.id}
              alignItems="flex-start"
              button
              onClick={() => Router.push('/chat/[id1]-[id2]', `/chat/${Math.min(user.id, userId)}/${Math.max(user.id, userId)}`)}
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
  const ret = await IsSessionAuthOnPage('private', apiObj);
  if (ret === false) {
    res.writeHead(302, {
      Location: '/signin',
    });
    res.end();
  }

  const u = await apiObj.get('users/current/matches');
  const users = u.data;

  const userId = 387;

  return { users, userId };
};