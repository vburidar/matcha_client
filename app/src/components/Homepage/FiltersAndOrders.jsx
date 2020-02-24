import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  Slider,
  Grid,
  Select,
  MenuItem,
  Box,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SettingsIcon from '@material-ui/icons/Settings';

const orders = [
  {
    value: 'relevance',
    name: 'Relevance',
  },
  {
    value: 'agedesc',
    name: 'Age (Desc)',
  },
  {
    value: 'ageasc',
    name: 'Age (Asc)',
  },
  {
    value: 'distance',
    name: 'Distance',
  },
  {
    value: 'popularity',
    name: 'Popularity',
  },
  {
    value: 'commoninterests',
    name: 'Common Interests',
  },
];

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
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

export default function Filter({
  filters, dispatchFilters, users, dispatchUsers,
}) {
  const [order, setOrder] = useState('relevance');
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [slidersData, setSlidersData] = useState({
    maxAge: 0,
    minAge: 100,
    distance: 0,
    maxInterests: 0,
    minInterests: 100,
    maxPopularity: 0,
    minPopularity: 100,
  });

  useEffect(() => {
    const newSlidersData = users.reduce((acc, curr) => {
      const popularity = parseInt(curr.score_popularity * 100, 10);
      acc.maxAge = (curr.age > acc.maxAge)
        ? curr.age
        : acc.maxAge;

      acc.minAge = (curr.age < acc.minAge)
        ? curr.age
        : acc.minAge;

      acc.distance = (Math.floor(curr.distance) > acc.distance)
        ? Math.floor(curr.distance)
        : acc.distance;

      acc.maxInterests = (parseInt(curr.common_interests, 10) > acc.maxInterests)
        ? parseInt(curr.common_interests, 10)
        : acc.maxInterests;

      acc.minInterests = (parseInt(curr.common_interests, 10) < acc.minInterests)
        ? parseInt(curr.common_interests, 10)
        : acc.minInterests;

      acc.maxPopularity = (popularity > acc.maxPopularity)
        ? popularity
        : acc.maxPopularity;

      acc.minPopularity = (popularity < acc.minPopularity)
        ? popularity
        : acc.minPopularity;

      return acc;
    }, slidersData);

    setSlidersData(newSlidersData);

    dispatchFilters({
      type: 'initialise',
      age: [slidersData.minAge, slidersData.maxAge],
      distance: newSlidersData.distance,
      popularity: [slidersData.minPopularity, slidersData.maxPopularity],
      commonInterests: slidersData.minInterests,
    });
  }, []);

  useEffect(() => {
    dispatchUsers({ type: order });
  }, [order]);

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
          <SettingsIcon className={classes.icon}/>
          <Typography>Options</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div className={classes.root}>
            <AppBar position="static">
              <Tabs centered value={value} onChange={handleChange} aria-label="simple tabs example">
                <Tab label="Filtering and ordering" />
                <Tab label="Search" />
              </Tabs>
            </AppBar>
            <TabPanel value={value} onChange={handleChange} index={0}>
              <Grid container>
                <Grid item container xs={12} sm={8}>
                  <Grid item container xs={12} alignItems="center">
                    <Grid item xs={3} align="right">
                      <Box pr={2}><Typography>Age</Typography></Box>
                    </Grid>
                    <Grid item xs>
                      <Slider
                        value={filters.age}
                        onChange={(e, val) => dispatchFilters({ type: 'setAge', age: val })}
                        valueLabelDisplay="auto"
                        aria-labelledby="age-range-slider"
                        getAriaValueText={(val) => `${val} years old`}
                        min={slidersData.minAge}
                        max={slidersData.maxAge}
                      />
                    </Grid>
                  </Grid>

                  <Grid item container xs={12} alignItems="center">
                    <Grid item xs={3} align="right">
                      <Box pr={2}><Typography>Distance</Typography></Box>
                    </Grid>
                    <Grid item xs>
                      <Slider
                        value={filters.distance}
                        onChange={(e, val) => dispatchFilters({ type: 'setDistance', distance: val })}
                        getAriaValueText={(val) => `${val} kilometers away`}
                    // valueLabelFormat={(val) => `${val} km`}
                        aria-labelledby="distance-slider"
                        valueLabelDisplay="auto"
                        min={1}
                        max={slidersData.distance}
                        step={1}
                      />
                    </Grid>
                  </Grid>

                  <Grid item container xs={12} alignItems="center">
                    <Grid item xs={3} align="right">
                      <Box pr={2}><Typography>Popularity</Typography></Box>
                    </Grid>
                    <Grid item xs>
                      <Slider
                        value={filters.popularity}
                        onChange={(e, val) => dispatchFilters({ type: 'setPopularity', popularity: val })}
                        valueLabelDisplay="auto"
                        aria-labelledby="popularity-range-slider"
                        getAriaValueText={(val) => `${val} popularity score`}
                        max={slidersData.maxPopularity}
                        min={slidersData.minPopularity}
                      />
                    </Grid>
                  </Grid>

                  <Grid item container xs={12} alignItems="center">
                    <Grid item xs={3} align="right">
                      <Box pr={2}><Typography>Common interests</Typography></Box>
                    </Grid>
                    <Grid item xs>
                      <Slider
                        value={filters.commonInterests}
                        onChange={(e, val) => dispatchFilters({ type: 'setCommonInterests', commonInterests: val })}
                        track="inverted"
                        disabled={slidersData.minInterests === slidersData.maxInterests}
                        getAriaValueText={(val) => `${val} common interests`}
                        aria-labelledby="common-interests-slider"
                        valueLabelDisplay="auto"
                        step={1}
                        min={slidersData.minInterests}
                        max={slidersData.maxInterests}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item container xs={12} sm={4} justify="center" alignItems="center">
                  <Grid item>
                    <Select
                      labelId="ordering-label"
                      id="ordering"
                      value={order}
                      onChange={(e) => setOrder(e.target.value)}
                    >
                      {orders.map((ordering) => (
                        <MenuItem key={ordering.value} value={ordering.value}>{ordering.name}</MenuItem>
                      ))}
                    </Select>
                  </Grid>
                </Grid>

              </Grid>
            </TabPanel>
            <TabPanel value={value} onChange={handleChange} index={1}>
              search
            </TabPanel>
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}
