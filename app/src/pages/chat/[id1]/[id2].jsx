import {
  useEffect, useState, useContext, createRef,
} from 'react';
import {
  Container,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Grid,
  FormControl,
  TextField,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { createApiRequester } from '../../../stores/Api';
import redirectTo from '../../../initialServices/initialServices';
import { SocketContext } from '../../../stores/Socket';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  paper: {
    padding: theme.spacing(2),
  },
  messagesContainer: {
    height: '60vh',
    overflowY: 'scroll',
    margin: theme.spacing(2),
  },
  messageWrapper: {
    margin: theme.spacing(1, 0),
  },
  message: {
    borderRadius: '14px',
    background: 'lightgray',
    maxWidth: '75%',
    padding: theme.spacing(0.5, 1),
  },
  currentUserMessage: {
    marginLeft: 'auto',
    backgroundColor: theme.palette.primary.light,
    color: 'white',
  },
}));

function ChatPage({ messagesData, userId, talker }) {
  const classes = useStyles();
  const {
    sendMessage,
    messages,
    dispatchMessages,
  } = useContext(SocketContext);

  const [messageText, setMessageText] = useState('');

  const messagesContainerDiv = createRef();

  function send() {
    setMessageText('');
    sendMessage(messageText, talker.id);
  }

  function handleKeyDown(e) {
    if (
      e.key === 'Enter' && e.shiftKey === false
    ) {
      e.preventDefault();
      send();
    }
  }

  useEffect(() => {
    dispatchMessages({
      type: 'initialiseMessages',
      messages: messagesData,
    });
  }, []);

  useEffect(() => {
    messagesContainerDiv.current.scrollTop = messagesContainerDiv.current.scrollHeight;
  }, [messages]);

  return (
    <Container maxWidth="md" className={classes.container}>
      <Paper className={classes.paper}>
        <Grid container alignContent="flex-start">
          <Grid item xs={12}>
            <List>
              <ListItem>
                <ListItemAvatar>
                  <Avatar
                    src="http://placehol.it/60x60"
                    alt="profile picture"
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={`${talker.first_name} - ${talker.age} years old`}
                  secondary={`${Math.ceil(talker.distance)}km away`}
                />
              </ListItem>
            </List>
            <Divider variant="middle" />
          </Grid>
          <Grid
            item
            container
            xs={12}
            className={classes.messagesContainer}
            ref={messagesContainerDiv}
            alignContent="flex-start"
          >
            {messages.map((message) => (
              <Grid item container xs={12} alignContent="flex-start" className={classes.messageWrapper} key={message.id}>
                <Grid
                  item
                  xs="auto"
                  className={`${classes.message} ${(message.sender_id === userId) ? classes.currentUserMessage : ''}`}
                >
                  {message.content}
                </Grid>
              </Grid>
            ))}
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth className={classes.formControl}>
              <TextField
                id="send-message"
                name="sendMessage"
                placeholder="Send Message"
                variant="outlined"
                multiline
                rows="2"
                onKeyDown={handleKeyDown}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
            </FormControl>
            <FormControl fullWidth className={classes.formControl}>
              <Button
                color="primary"
                onClick={send}
              >
                Send
              </Button>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
export default ChatPage;

ChatPage.getInitialProps = async ({ req, res, query }) => {
  const apiObj = createApiRequester(req);
  const { data } = await apiObj.get('users/status');
  if (data.connected === false) {
    redirectTo('/signin', req, res);
  }
  if (data.profileIsComplete === false) {
    redirectTo('/complete-profile', req, res);
  }
  const id1 = parseInt(query.id1, 10);
  const id2 = parseInt(query.id2, 10);

  const talkerId = (id1 === data.user_id) ? id2 : id1;
  const messagesQueryRes = await apiObj.get('users/message', { params: { talkerId } });
  const talkerQueryRes = await apiObj.get(`users/getProfileInfo/${talkerId}`);
  return {
    messagesData: messagesQueryRes.data.rows,
    userId: data.user_id,
    talker: talkerQueryRes.data.rows[0],
  };
};
