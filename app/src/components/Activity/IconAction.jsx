import { useState } from 'react';
import VisibilityIcon from '@material-ui/icons/Visibility';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  icon: {
    margin: theme.spacing(1),
  },
}
));

const IconAction = (props) => {
  const [data] = useState(props.props);
  const classes = useStyles();

  if (data.type === 'visit') {
    return (

      <div>
        <VisibilityIcon className={classes.icon} />
      </div>
    );
  } if (data.type === 'like') {
    return (
      <div>
        <InsertEmoticonIcon className={classes.icon} />
      </div>
    );
  } if (data.type === 'match') {
    return (
      <div>
        <FavoriteIcon className={classes.icon} />
      </div>
    );
  }
  return (null);
};

export default IconAction;
