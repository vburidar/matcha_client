import {
  useEffect, useState, useReducer, useContext, createContext,
} from 'react';
import io from 'socket.io-client';

export const SocketContext = createContext(null);

function messagesReducer(state, action) {
  switch (action.type) {
    case 'initialiseMessages':
      return [].concat(action.messages);
    case 'addMessage':
      return [].concat(state, action.message);
    default:
      return state;
  }
}

function notificationsReducer(state, action) {
  switch (action.type) {
    case 'initialiseNotifications':
      return [].concat(action.notifications);
    default:
      return state;
  }
}

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState({});
  const [messages, dispatchMessages] = useReducer(messagesReducer, []);
  const [notifications, dispatchNotifications] = useReducer(notificationsReducer, []);

  useEffect(() => {
    const sock = io('http://localhost:8080');

    sock.on('connect', () => {
      console.log('CONNECTED');
      setSocket(sock);
      sock.emit('getNotifications');
    });

    sock.on('allNotifications', (notificationsData) => {
      console.log('ALLNOTIFICATIONS', notificationsData.notifications);
      dispatchNotifications({
        type: 'initialiseNotifications',
        notifications: notificationsData.notifications,
      });
    });

    sock.on('messageReceived', ({ message }) => {
      dispatchMessages({
        type: 'addMessage',
        message,
      });
    });
  }, []);

  function createVisit(receiverId) {
    socket.emit('createVisit', { receiverId });
  }

  async function sendMessage(messageText, talkerId) {
    if (messageText.trim() !== '') {
      socket.emit('createMessage', {
        receiverId: talkerId,
        content: messageText,
      });
    }
  }

  const value = {
    socket,
    sendMessage,
    messages,
    dispatchMessages,
    notifications,
    createVisit,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}
