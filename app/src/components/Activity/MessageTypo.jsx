import { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  icon: {
    margin: theme.spacing(1),
  },
}
));

const MessageTypo = (props) => {
  const [data] = useState(props.props);
  const classes = useStyles();

  if (data.type === 'visit') {
    return (
      <Typography className={classes.typo} color="textPrimary" variant="h6" component="h4">
        {data.first_name}
        {' visited your profile'}
      </Typography>
    );
  } if (data.type === 'like') {
    return (
      <Typography className={classes.typo} color="textPrimary" variant="h6" component="h4">
        {data.first_name}
        {' liked your profile'}
      </Typography>
    );
  } if (data.type === 'match') {
    return (
      <Typography className={classes.typo} color="textPrimary" variant="h6" component="h4">
        {'You matched with '}
        {data.first_name}
      </Typography>
    );
  }
  return (null);
};

export default MessageTypo;
