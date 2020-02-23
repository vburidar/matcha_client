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
import { ApiContext, ApiProvider } from '../../stores/Api';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(3),
  },
  image: {
  },
  title: {
    color: 'black',
  },
  typo: {
    paddingBottom: theme.spacing(2),
  },
  maintext: {
    color: 'grey',
  },
  containerMain: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  chip: {
    margin: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    textAlign: 'center',
    position: 'relative',
  },
  justifiedText: {
    textAlign: 'justify',
  },
  containerLef: {
    justifyContent: 'left',
  },
  buttonBottom: {
    margin: theme.spacing(1),
  },
  textField: {
    padding: theme.spacing(1),
  },
  reportMenu: {
    position: 'absolute',
    top: '10px',
    left: '10px',
  },
}));

export default function reportDialog({ props }) {
  const [openReportDialog, setOpenDialogReport] = useState(false);
  const [openBlockDialog, setOpenDialogBlock] = useState(false);
  const [value, setValue] = React.useState('harassment');
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const { createBlock, createReport } = useContext(ApiContext);

  function handleCloseMenu() {
    setAnchorEl(null);
  }

  function handleOpenMenu(event) {
    setAnchorEl(event.currentTarget);
  }

  const handleOpenDialogReport = () => {
    setOpenDialogReport(true);
  };

  const handleCloseDialogReport = () => {
    setOpenDialogReport(false);
  };

  const handleOpenDialogBlock = () => {
    setOpenDialogBlock(true);
  };

  const handleCloseDialogBlock = () => {
    setOpenDialogBlock(false);
  };

  async function blockUser() {
    await createBlock({
      user_id: props.id,
    });
    setOpenDialogBlock(false);
    router.push(`/profile/${props.id}`);
  }

  async function reportUser() {
    await createReport({
      user_id: props.id,
      type: value,
    });
    setOpenDialogReport(false);
  }

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div>
      <IconButton aria-controls="simple-menu" aria-haspopup="true" className={classes.reportMenu} onClick={handleOpenMenu}>
        <ReportIcon />
      </IconButton>
      <Menu
        getContentAnchorEl={null}
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={function (event) { handleCloseMenu(); handleOpenDialogReport(); }}>Report User</MenuItem>
        <MenuItem onClick={function (event) { handleCloseMenu(); handleOpenDialogBlock(); }}>Block User</MenuItem>
      </Menu>
      <Dialog open={openReportDialog} onClose={handleCloseDialogReport} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Report</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the reason you have to report this user. Be aware that reports are not retractable
          </DialogContentText>
          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">Reason</FormLabel>
            <RadioGroup aria-label="report_reason" name="report_reason" onChange={handleChange}>
              <FormControlLabel value="harassment" control={<Radio />} label="Harassment" />
              <FormControlLabel value="fraud" control={<Radio />} label="Fraud" />
              <FormControlLabel value="identity_theft" control={<Radio />} label="Identity theft" />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogReport} color="primary">
            Cancel
          </Button>
          <Button onClick={reportUser} color="primary">
            Report
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openBlockDialog} onClose={handleCloseDialogBlock} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Block</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to block this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogBlock} color="primary">
            Cancel
          </Button>
          <Button onClick={blockUser} color="primary">
            Block
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
