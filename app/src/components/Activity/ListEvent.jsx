import router from 'next/router';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import {
  Avatar, Container, Paper,
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import IconAction from './IconAction';
import MessageTypo from './MessageTypo';
import TimeTypo from './TimeTypo';
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

export default function ListEvent({ props }) {
  const classes = useStyles();
  const { data, type } = props;
  const [tab, setTab] = useState([]);
  function testType(element) {
    return element.type === type;
  }

  useEffect(() => {
    console.log(data);
    setTab(data.filter(testType));
  }, []);

  if (type === 'all') {
    return (
      <Container>
        {data.map((element) => (
          <Paper className={classes.paper} key={`${element.type}/${element.receiver_id}/${element.sender_id}/${element.created_at}`}>
            <div className={classes.div}>
              <IconAction props={element} />
              <Avatar className={classes.avatar} alt={element.first_name} src={element.path} />
              <MessageTypo props={element} />
            </div>
            <TimeTypo props={element} />
            <Button component={LinkButton} variant="contained" id={element.id} className={classes.button} href="/profile/[id]" hrefAs={`/profile/${element.sender_id}`}>
              See
              {' '}
              {element.first_name}
              {' '}
              {'\'s profile'}
            </Button>
          </Paper>
        ))}
      </Container>
    );
  }
  return (
    <Container>
      {tab.map((element) => (
        <Paper className={classes.paper} key={`${element.typ}/${element.receiver_id}/${element.sender_id}/${element.created_at}`}>
          <div className={classes.div}>
            <IconAction props={element} />
            <Avatar className={classes.avatar} alt={element.first_name} src={element.path} />
            <MessageTypo props={element} />
          </div>
          <TimeTypo props={element} />
          <Button component={LinkButton} variant="contained" id={element.id} className={classes.button} href="/profile/[id]" hrefAs={`/profile/${element.sender_id}`}>
            See
            {' '}
            {element.first_name}
            {' '}
            {'\'s profile'}
          </Button>
        </Paper>
      ))}
    </Container>
  );
}
