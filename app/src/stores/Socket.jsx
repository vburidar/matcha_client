import {
  useEffect, useState, useReducer, useContext, createContext,
} from 'react';
import io from 'socket.io-client';

import { StoreContext } from '../store/Store';

export const SocketContext = createContext(null);

function messagesReducer(state, action) {
  console.log('messageReducer', state, action);
  switch (action.type) {
    case 'initialiseMessages':
      return action.messages;
    case 'addMessage':
      return state.concat(action.message);
    default:
      return state;
  }
}

function notificationsReducer(state, action) {
  switch (action.type) {
    case 'initialiseNotifications':
      return [].concat(action.notifications);
    case 'addNotification':
      return [].concat(state, action.notification);
    default:
      return state;
  }
}

function usersConnectedReducer(state, action) {
  console.log('usersConnectedReducer', state, action);
  switch (action.type) {
    case 'initialiseUsersConnected':
      return action.userIds.reduce((acc, userId) => ({
        ...acc,
        [userId]: true,
      }), {});
    case 'setUserConnected':
      return {
        ...state,
        [action.userId]: true,
      };
    case 'setUserDisconnected':
      return {
        ...state,
        [action.userId]: false,
      };
    default:
      return state;
  }
}

export function SocketProvider({ children }) {
  const { state } = useContext(StoreContext);
  const [socket, setSocket] = useState({});
  const [messages, dispatchMessages] = useReducer(messagesReducer, []);
  const [notifications, dispatchNotifications] = useReducer(notificationsReducer, []);
  const [usersConnected, dispatchUsersConnected] = useReducer(usersConnectedReducer, {});

  function initialiseSocket() {
    /** All listeners */
    socket.on('allNotifications', (notificationsData) => {
      dispatchNotifications({
        type: 'initialiseNotifications',
        notifications: notificationsData.notifications,
      });
    });

    socket.on('allUsersConnected', ({ userIds }) => {
      if (userIds !== null) {
        dispatchUsersConnected({ type: 'initialiseUsersConnected', userIds });
      }
    });

    socket.on('messageReceived', ({ message }) => {
      const userId = (messages[message.sender_id])
        ? message.sender_id
        : message.receiver_id;
      dispatchMessages({
        type: 'addMessage',
        message,
      });
    });

    socket.on('notificationReceived', ({ notification }) => {
      dispatchNotifications({
        type: 'addNotification',
        notification,
      });
    });

    socket.on('userConnected', ({ userId }) => {
      dispatchUsersConnected({ type: 'setUserConnected', userId });
    });

    socket.on('userDisconnected', ({ userId }) => {
      dispatchUsersConnected({ type: 'setUserDisconnected', userId });
    });

    /** Actions on first load (after listeners of course) */
    socket.emit('getNotifications');
    socket.emit('getUsersConnected');
  }

  useEffect(() => {
    console.log('SOCKET CHANGE');
    if (Object.keys(socket).length > 0) {
      initialiseSocket();
    }
  }, [socket]);

  useEffect(() => {
    if (state.inSession) {
      const sock = io('http://localhost:8080');

      sock.on('connect', () => {
        setSocket(sock);
      });
    } else if (Object.keys(socket).length !== 0) {
      socket.disconnect();
    }
  }, [state.inSession]);

  function createVisit(receiverId) {
    socket.emit('createVisit', { receiverId });
  }

  function createLike(receiverId) {
    socket.emit('createLike', { receiverId });
  }

  function deleteLike(receiverId) {
    socket.emit('deleteLike', { receiverId });
  }

  function createMessage(receiverId, content) {
    socket.emit('createMessage', {
      receiverId,
      content,
    });
  }

  function markAllNotificationsAsRead() {
    socket.emit('markAllNotificationsAsRead');
  }

  function subscribeChat(receiverId) {
    socket.emit('subscribeChat', { receiverId });
  }
  function unSubscribeChat(receiverId) {
    socket.emit('unSubscribeChat', { receiverId });
  }

  const value = {
    socket,
    messages,
    dispatchMessages,
    notifications,
    usersConnected,
    createVisit,
    createLike,
    deleteLike,
    createMessage,
    markAllNotificationsAsRead,
    subscribeChat,
    unSubscribeChat,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}
