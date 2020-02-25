import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  Box,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SettingsIcon from '@material-ui/icons/Settings';
import FiltersAndOrders from './FiltersAndOrders';
import Search from './Search';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  icon: {
    marginRight: theme.spacing(1),
  },
}));

function TabPanel(props) {
  const {
    children, value, index, ...other
  } = props;

  return (
    <div>
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

export default function OptionPanel({
  filters, dispatchFilters, users, dispatchUsers,
}) {
  const classes = useStyles();
  const [value, setValue] = useState(0);


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="filter-content"
          id="filter-header"
        >
          <SettingsIcon className={classes.icon} />
          <Typography>Options</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div className={classes.root}>
            <Tabs
              centered
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              aria-label="simple tabs example"
            >
              <Tab label="Filtering and ordering" />
              <Tab label="Search" />
            </Tabs>
            <TabPanel value={value} onChange={handleChange} index={0}>
              <FiltersAndOrders
                filters={filters}
                dispatchFilters={dispatchFilters}
                users={users}
                dispatchUsers={dispatchUsers}
              />
            </TabPanel>
            <TabPanel value={value} onChange={handleChange} index={1}>
              <Search />
            </TabPanel>
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}
