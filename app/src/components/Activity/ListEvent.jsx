import { useEffect } from 'react';
import {
  Avatar,
  Container,
  Paper,
  Button,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { formatDistance } from 'date-fns';


import IconAction from './IconAction';
import LinkButton from '../LinkButton';


const useStyles = makeStyles((theme) => ({
  image: {
  },

  paper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: theme.spacing(1),
  },

  avatar: {
    margin: theme.spacing(1),
  },

  typo: {
    margin: theme.spacing(1),
  },

  button: {
    display: 'flex',
    margin: theme.spacing(2),
    alignSelf: 'end',
  },
  icon: {
    margin: theme.spacing(2),
  },

  div: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

const getMessageFromType = (firstName) => ({
  visit: `${firstName} visited your profile`,
  like: `${firstName} liked your profile`,
  match: `You matched with ${firstName}`,
});

export default function ListEvent({ props }) {
  const classes = useStyles();
  const { data, type } = props;

  return (
    <Container>
      {data
        .filter((el) => el.type === type || type === 'all')
        .map((el) => (
          <Paper
            className={classes.paper}
            key={`${el.type}/${el.receiver_id}/${el.sender_id}/${el.created_at}`}
          >
            <div className={classes.div}>
              <IconAction type={el.type} />
              <Avatar className={classes.avatar} alt={el.first_name} src={el.path} />
              <Typography className={classes.typo} color="textPrimary" variant="h6" component="h4">
                {getMessageFromType(el.first_name)[el.type]}
              </Typography>
            </div>
            <Typography color="textSecondary" component="h4">
              {formatDistance(
                new Date(el.created_at),
                new Date(),
                { addSuffix: true },
              )}
            </Typography>
            <Button component={LinkButton} variant="contained" id={el.id} className={classes.button} href={`/profile/${el.sender_id}`}>
              See
              {' '}
              {el.first_name}
              {' '}
              {'\'s profile'}
            </Button>
          </Paper>
        ))}
    </Container>
  );
}
