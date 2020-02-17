import { useState, useContext } from 'react';
import router from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
  Radio, FormControlLabel, FormControl, RadioGroup, FormLabel, Chip, IconButton, Menu, MenuItem,
} from '@material-ui/core';
import ReportIcon from '@material-ui/icons/Report';
import { ApiContext, ApiProvider } from '../../api/Api';

const useStyles = makeStyles((theme) => ({

}));

export default function ReportDialog({ props }) {
  const [open, setOpen] = useState(true);
  const { deleteBlock } = useContext(ApiContext);

  function handleCloseDialog() {

  }

  const backToHome = () => {
    router.push('/homepage');
  };

  const unblockUser = () => {
    async function sendUnblock() {
      await deleteBlock({
        data: {
          user_id: props.id,
        },
      });
    }
    sendUnblock();
    router.push(`/profile/${props.id}`);
  };
  if (props.visitor_blocked_visited) {
    return (
      <Dialog open={open} onClose={handleCloseDialog} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Block</DialogTitle>
        <DialogContent>
          <DialogContentText>
          You blocked this User. You cannot access this page unless you cancel your block.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={backToHome} color="primary">
        Back to homepage
          </Button>
          <Button onClick={unblockUser} color="primary">
        Unblock user
          </Button>
        </DialogActions>
      </Dialog>
    );
  } if (props.visited_blocked_visitor) {
    return (
      <Dialog open={open} onClose={handleCloseDialog} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Block</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This user blocked you. You cannot access to this page anymore.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={backToHome} color="primary">
            Back to homepage
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  return (null);
}
