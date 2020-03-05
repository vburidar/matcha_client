import Link from 'next/link';
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
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { createApiRequester } from '../../../stores/Api';
import redirectTo from '../../../initialServices/initialServices';
import { SocketContext } from '../../../stores/Socket';
import { StoreContext } from '../../../store/Store';
import ErrorComponent from '../../../components/ErrorComponent';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  paper: {
    padding: theme.spacing(2),
  },
  online: {
    border: `solid 2px ${theme.palette.success.main}`,
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
  wordBreak: {
    wordBreak: 'break-word',
  },
  currentUserMessage: {
    marginLeft: 'auto',
    backgroundColor: theme.palette.primary.light,
    color: 'white',
  },
}));

export default function SingleChatPage({
  type, messagesData, userId, talker,
}) {
  const classes = useStyles();
  const {
    socket,
    usersConnected,
    messages,
    dispatchMessages,
    createMessage,
    subscribeChat,
    unSubscribeChat,
  } = useContext(SocketContext);
  const { dispatch } = useContext(StoreContext);

  const [messageText, setMessageText] = useState('');

  const messagesContainerDiv = createRef();

  function send() {
    if (messageText.trim() !== '') {
      setMessageText('');
      createMessage(talker.id, messageText);
    }
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
    if (type === 'success') {
      if (Object.keys(socket).length > 0) {
        subscribeChat(talker.id);
      }
    }
  }, [socket]);

  useEffect(() => {
    dispatch({ type: 'UPDATE_CONNECTION_STATUS', inSession: true, user_id: userId });
    dispatchMessages({
      type: 'initialiseMessages',
      messages: messagesData,
    });

    return () => {
      console.log(socket, messages);
      // TO DO unsubscribe
      // unSubscribeChat(talker.id);
    };
  }, []);

  useEffect(() => {
    if (type === 'success') {
      messagesContainerDiv.current.scrollTop = messagesContainerDiv.current.scrollHeight;
    }
  }, [messages]);

  if (type === 'error') {
    return (<ErrorComponent status={400} message="cannot fetch data from server" />);
  }
  return (
    <Container maxWidth="md" className={classes.container}>
      <Paper className={classes.paper}>
        <Grid container alignContent="flex-start">
          <Grid item xs={12}>
            <List>
              <ListItem>
                <ListItemAvatar>
                  <Link href="/profile/[id]" as={`/profile/${talker.id}`}>
                    <a>
                      <Avatar
                        src={talker.path}
                        alt="profile picture"
                        className={usersConnected[talker.id] === true ? classes.online : ''}
                      />
                    </a>
                  </Link>
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
            {messages.length > 0 && messages.map((message) => (
              <Grid item container xs={12} alignContent="flex-start" className={classes.messageWrapper} key={message.id}>
                <Grid
                  item
                  xs="auto"
                  className={`${classes.message} ${(message.sender_id === userId) ? classes.currentUserMessage : ''}`}
                >
                  <Typography className={classes.wordBreak}>{message.content}</Typography>
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

SingleChatPage.getInitialProps = async ({ req, res, query }) => {
  try {
    const apiObj = createApiRequester(req);
    const { data } = await apiObj.get('users/status');
    const id1 = parseInt(query.id1, 10);
    const id2 = parseInt(query.id2, 10);

    if (data.connected === false) {
      redirectTo('/signin', req, res);
    }
    if (data.profileIsComplete === false) {
      redirectTo('/complete-profile', req, res);
    }

    const matchesQueryRes = await apiObj.get('users/current/matches');
    if (
      matchesQueryRes.data.findIndex((el) => el.id === id1 || el.id === id2) === -1
    || [id1, id2].indexOf(data.user_id) === -1
    || id1 >= id2
    ) {
      redirectTo('/chat', req, res);
    }

    const talkerId = (id1 === data.user_id) ? id2 : id1;

    const messagesQueryRes = await apiObj.get('users/message', { params: { talkerId } });
    const talkerQueryRes = await apiObj.get(`users/${talkerId}`);

    return {
      type: 'success',
      messagesData: messagesQueryRes.data.rows,
      userId: data.user_id,
      talker: talkerQueryRes.data.rows[0],
    };
  } catch (err) {
    return {
      type: 'error',
      messagesData: null,
      userId: null,
      talker: null,
    };
  }
};
