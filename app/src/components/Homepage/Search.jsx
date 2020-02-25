import { useState, useContext, useEffect } from 'react';
import {
  Grid, Slider, Box, Typography, TextField, Button, Container, Select, MenuItem, Chip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LocationPicker from './LocationPicker';
import { ApiContext } from '../../stores/Api';

const orders = [
  {
    value: 'distance',
    name: 'Distance',
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
    value: 'popularity',
    name: 'Popularity',
  },
  {
    value: 'commoninterests',
    name: 'Common Interests',
  },
];

const marks = [
  {
    value: 10,
    label: '10km',
  },
  {
    value: 19,
    label: '100km',
  },
  {
    value: 29,
    label: '1000km',
  },
  {
    value: 39,
    label: '10000km',
  },
];

const useStyles = makeStyles((theme) => ({
  gridElement: {
    margin: theme.spacing(2),
  },
  button: {
    textAlign: 'center',
  },
  buttonAdd: {
    margin: theme.spacing(1),
  },
}));

export default function Search() {
  const { searchUsers } = useContext(ApiContext);
  const [order, setOrder] = useState('distance');
  const [slidersData, setSlidersData] = useState({
    maxAge: 100,
    minAge: 0,
    distance: 0,
    maxInterests: 0,
    minInterests: 100,
    maxPopularity: 100,
    minPopularity: 0,
  });
  const [searchAge, setSearchAge] = useState([0, 100]);
  const [searchDistance, setSearchDistance] = useState(5);
  const [searchPopularity, setSearchPopularity] = useState([0, 100]);
  const [searchInterest, setSearchInterest] = useState('');
  const [interestList, setInterestList] = useState([]);
  const [searchLocation, setSearchLocation] = useState({ label: '', type: 'default' });
  const classes = useStyles();

  function logScale(value) {
    if (value <= 10) {
      return (value);
    }
    if (value <= 20) {
      return ((value - 9) * 10);
    }
    if (value <= 30) {
      return ((value - 19) * 100);
    }
    if (value <= 40) {
      return ((value - 29) * 1000);
    }
    return (value * 10000);
  }

  function formatInterest(value) {
    return (value.toLowerCase().replace(' ', '_'));
  }

  async function sendSearchRequest() {
    const distance = logScale(searchDistance);
    const interest = [];
    interestList.map((elem) => {
      interest.push(formatInterest(elem));
      return (null);
    });

    await searchUsers({
      params: {
        age: searchAge,
        distance,
        popularity: searchPopularity,
        interest,
        location: searchLocation,
        order,
      },
    });
  }

  useEffect(() => {
    if (interestList.length === 0) {
      setInterestList([...interestList, 'any interest']);
    }
  });

  const handleDelete = (chipToDelete) => () => {
    if (chipToDelete !== 'any interest' || interestList.length > 1) {
      setInterestList(interestList.filter((chip) => chip !== chipToDelete));
    }
  };

  function addInterest() {
    console.log(searchInterest);
    console.log(interestList[0]);
    if (interestList.length === 1 && interestList[0] === 'any interest') {
      console.log('exception');
      setInterestList([searchInterest]);
    } else {
      setInterestList([...interestList, searchInterest]);
    }
  }

  return (
    <Grid container>
      <Grid item container xs={12} sm={8}>
        <Grid className={classes.gridElement} item container xs={12} alignItems="center">
          <Grid item xs={3} align="right">
            <Box pr={2}><Typography>Interest</Typography></Box>
          </Grid>
          <Grid item xs>
            <TextField
              id="interest"
              name="interest"
              value={searchInterest}
              onChange={(e) => setSearchInterest(e.target.value)}
            />
            <Button className={classes.buttonAdd} onClick={addInterest} variant="outlined">ADD</Button>
            {interestList.map((label) => (
              <Chip
                key={label}
                size="small"
                className={classes.chip}
                label={label}
                onDelete={label === 'any interest' ? undefined : handleDelete(label)}
              />
            ))}
          </Grid>
        </Grid>

        <Grid className={classes.gridElement} item container xs={12} alignItems="center">
          <Grid item xs={3} align="right">
            <Box pr={2}><Typography>Position</Typography></Box>
          </Grid>
          <Grid item xs>
            <LocationPicker location={searchLocation} setLocation={setSearchLocation} />
          </Grid>
        </Grid>

        <Grid className={classes.gridElement} item container xs={12} alignItems="center">
          <Grid item xs={3} align="right">
            <Box pr={2}><Typography>Distance to position</Typography></Box>
          </Grid>
          <Grid item xs>
            <Slider
              value={searchDistance}
              onChange={(e, val) => setSearchDistance(val)}
              getAriaValueText={(val) => `${val} kilometers away`}
              aria-labelledby="distance-slider"
              valueLabelDisplay="auto"
              scale={(x) => logScale(x)}
              step={1}
              min={0}
              max={39}
              logScale
              marks={marks}
            />
          </Grid>
        </Grid>

        <Grid className={classes.gridElement} item container xs={12} alignItems="center">
          <Grid item xs={3} align="right">
            <Box pr={2}><Typography>Age</Typography></Box>
          </Grid>
          <Grid item xs>
            <Slider
              value={searchAge}
              onChange={(e, val) => setSearchAge(val)}
              valueLabelDisplay="auto"
              aria-labelledby="age-range-slider"
              getAriaValueText={(val) => `${val} years old`}
              min={slidersData.minAge}
              max={slidersData.maxAge}
            />
          </Grid>
        </Grid>
        <Grid className={classes.gridElement} item container xs={12} alignItems="center">
          <Grid item xs={3} align="right">
            <Box pr={2}><Typography>Popularity</Typography></Box>
          </Grid>
          <Grid item xs>
            <Slider
              value={searchPopularity}
              onChange={(e, val) => setSearchPopularity(val)}
              valueLabelDisplay="auto"
              aria-labelledby="popularity-range-slider"
              getAriaValueText={(val) => `${val} popularity score`}
              max={slidersData.maxPopularity}
              min={slidersData.minPopularity}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item container xs={12} sm={4} justify="center" alignItems="center">
        <Grid item>
          <Typography>
            Order by
          </Typography>
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
      <Container className={classes.button}>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={sendSearchRequest}
        >
          Search

        </Button>
      </Container>
    </Grid>
  );
}
