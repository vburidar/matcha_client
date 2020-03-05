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

export default function IconAction({ type }) {
  const classes = useStyles();

  const iconsFromType = {
    visit: <VisibilityIcon className={classes.icon} />,
    like: <InsertEmoticonIcon className={classes.icon} />,
    match: <FavoriteIcon className={classes.icon} />,
  };

  return (
    <div>
      {iconsFromType[type]}
    </div>
  );
}
