import router from 'next/router';
import Link from 'next/link';
import { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
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
import { newNotification } from '../../../store/actions';
import { StoreContext } from '../../../store/Store';
import { ApiContext } from '../../../stores/Api';
import { SocketContext } from '../../../stores/Socket';
import LinkButton from '../../LinkButton';

function getNotificationMessage(notification) {
  switch (notification.type) {
    case 'like':
      return `${notification.firstName} sent you a like`;
    case 'match':
      return `Matched with ${notification.firstName}`;
    case 'message':
      return `New message from ${notification.firstName}`;
    case 'unlike':
      return `${notification.firstName} unliked you`;
    case 'visit':
      return `${notification.firstName} visited your profile`;
    default:
      return '';
  }
}

function getNotificationLink(notification) {
  if (['like', 'unlike', 'visit'].indexOf(notification.type) > -1) {
    return `http://${process.env.DOMAIN}:3000/profile/${notification.senderId}`;
  }
  if (['match', 'message'].indexOf(notification.type) > -1) {
    return `http://${process.env.DOMAIN}:3000/chat/${Math.min(notification.senderId, notification.receiverId)}/${Math.max(notification.senderId, notification.receiverId)}`;
  }
  return '/';
}

function getTimeElapsedMessage(notification) {
  if (notification.yearsSince > 0) {
    return `${notification.yearsSince} years ago`;
  }
  if (notification.monthsSince > 0) {
    return `${notification.monthsSince} months ago`;
  }
  if (notification.daysSince > 0) {
    return `${notification.daysSince} days ago`;
  }
  if (notification.hoursSince > 0) {
    return `${notification.hoursSince} hours ago`;
  }
  if (notification.minuteSince > 0) {
    return `${notification.minuteSince} minutes ago`;
  }
  return 'A few seconds ago';
}

const useStyles = makeStyles((theme) => ({
  notificationList: {
    maxHeight: '50vh',
    overflowY: 'scroll',
  },
}));

export default function ButtonListConnected() {
  const classes = useStyles();
  const { state, dispatch } = useContext(StoreContext);
  const { sessionDelete } = useContext(ApiContext);
  const { notifications, markAllNotificationsAsRead } = useContext(SocketContext);

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  async function handleLogout() {
    try {
      await sessionDelete();
      dispatch({ type: 'UPDATE_CONNECTION_STATUS', inSession: false });
    } catch (err) {
      return newNotification(dispatch, { message: err.message, severity: 'error' });
    }
    router.push('/signin');
    return (null);
  }

  function handleNotificationButtonClick(e) {
    setAnchorEl(e.currentTarget);
    markAllNotificationsAsRead();
  }

  if (state.inSession === true) {
    return (
      <div>
        <IconButton color="inherit" onClick={handleNotificationButtonClick}>
          <Badge
            badgeContent={notifications.filter((el) => el.read === false).length}
            color="error"
          >
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
          <List component="nav" className={classes.notificationList}>
            {notifications.length === 0 && (
              <ListItem>
                <ListItemText
                  primary="No notifications"
                />
              </ListItem>
            )}

            {notifications.map((notification) => (
              <ListItem
                key={notification.id}
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
        <Button color="inherit" component={LinkButton} href="/profile/settings">
          Settings
        </Button>
        <Button color="inherit" component={LinkButton} href="/profile/[id]" hrefAs={`/profile/${state.user_id}`}>
          My Profile
        </Button>
        <Button color="inherit" component={LinkButton} href="/chat">
          Chat
        </Button>
        <Button color="inherit" component={LinkButton} href="/activity">
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
