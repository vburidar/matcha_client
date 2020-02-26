import {
  useEffect, useState, useReducer, useContext, createContext,
} from 'react';
import io from 'socket.io-client';

import { StoreContext } from '../store/Store';

export const SocketContext = createContext(null);

function messagesReducer(state, action) {
  switch (action.type) {
    case 'initialiseMessages':
      return {
        ...state,
        [action.userId]: action.messages,
      };
    case 'addMessage':
      return {
        ...state,
        [action.userId]: state.concat(action.messages),
      };
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
      dispatchUsersConnected({ type: 'initialiseUsersConnected', userIds });
    });

    socket.on('messageReceived', ({ message }) => {
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
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}
