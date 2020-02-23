import router from 'next/router';
import { useState, useEffect, useContext } from 'react';
import {
  Button,
  IconButton,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';

import { StoreContext } from '../../../store/Store';
import { ApiContext } from '../../../stores/Api';
import { SocketContext } from '../../../stores/Socket';

function getNotificationMessage(notification) {
  switch (notification.type) {
    case 'like':
      return `${notification.first_name} sent you a like`;
    case 'match':
      return `Matched with ${notification.first_name}`;
    case 'message':
      return `New message from ${notification.first_name}`;
    case 'unlike':
      return `${notification.first_name} unliked you`;
    case 'visit':
      return `${notification.first_name} visited your profile`;
    default:
      return '';
  }
}

function getNotificationLink(notification) {
  if (['like', 'unlike', 'visit'].indexOf(notification.type) > -1) {
    return `http://localhost:3000/profile/${notification.sender_id}`;
  }
  if (['match', 'message'].indexOf(notification.type) > -1) {
    return `http://localhost:3000/chat/${Math.min(notification.sender_id, notification.receiver_id)}/${Math.max(notification.sender_id, notification.receiver_id)}`;
  }
  return '/';
}

function getTimeElapsedMessage(notification) {
  if (notification.years_since > 0) {
    return `${notification.years_since} years ago`;
  }
  if (notification.months_since > 0) {
    return `${notification.months_since} months ago`;
  }
  if (notification.days_since > 0) {
    return `${notification.days_since} days ago`;
  }
  if (notification.hours_since > 0) {
    return `${notification.hours_since} hours ago`;
  }
  if (notification.minute_since > 0) {
    return `${notification.minute_since} minutes ago`;
  }
  return 'A few seconds ago';
}

function ButtonListConnected() {
  const { state, dispatch } = useContext(StoreContext);
  const { sessionDelete } = useContext(ApiContext);
  const { notifications } = useContext(SocketContext);

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  async function handleLogout() {
    try {
      await sessionDelete();
      dispatch({ type: 'UPDATE_CONNECTION_STATUS', inSession: false });
    } catch (err) {
      console.log('error');
    }
    router.push('/signin');
  }

  if (state.inSession === true) {
    return (
      <div>
        <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
          <Badge badgeContent={notifications.length} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <List component="nav">
            {notifications.length === 0 && (
              <ListItem>
                <ListItemText
                  primary="No new notifications"
                />
              </ListItem>
            )}

            {notifications.map((notification) => (
              <ListItem
                key={`${notification.sender_id}${notification.type}${getTimeElapsedMessage(notification)}`}
                button
                component="a"
                href={getNotificationLink(notification)}
              >
                <ListItemText
                  primary={getNotificationMessage(notification)}
                  secondary={getTimeElapsedMessage(notification)}
                />
              </ListItem>
            ))}
          </List>
        </Popover>
        <Button
          color="inherit"
          onClick={() => router.push('/profile/settings')}
        >
          Settings
        </Button>
        <Button
          color="inherit"
          onClick={() => router.push(`/profile/${state.user_id}`)}
        >
          My Profile
        </Button>
        <Button
          color="inherit"
          onClick={() => router.push('/chat')}
        >
          Chat
        </Button>
        <Button
          color="inherit"
          onClick={() => router.push('/activity', { shallow: false })}
        >
          Activity
        </Button>
        <Button
          color="inherit"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    );
  }
  return (null);
}


export default ButtonListConnected;
