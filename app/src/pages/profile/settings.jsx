import {
  useEffect, useContext, useState, useReducer,
} from 'react';
import { makeStyles } from '@material-ui/core/styles';

import {
  Grid,
  Container,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
} from '@material-ui/core';

import GeneralSettings from '../../components/settings/GeneralSettings';
import PicturesSettings from '../../components/settings/PicturesSettings';
import LocationsSettings from '../../components/settings/LocationsSettings';

import { createApiRequester, IsSessionAuthOnPage } from '../../api/Api';
import { StoreContext } from '../../store/Store';
import { getLabelFromPos, SettingsContext } from '../../Settings';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3),
  },
  alignRight: {
    textAlign: 'right',
  },
}));

function intToBitsArray(value) {
  const ret = [];
  for (let bitToTest = 32; bitToTest > 0; bitToTest /= 2) {
    if ((value & bitToTest) === bitToTest) {
      ret.push(bitToTest);
    }

    if (bitToTest === 1) break;
  }
  return ret;
}

export default function SettingsPage({ user }) {
  const classes = useStyles();
  const { dispatch } = useContext(StoreContext);
  const {
    inputs,
    setInputs,
    pictures,
    dispatchPictures,
    locations,
    dispatchLocations,
    generalDisabled,
    picturesDisabled,
    locationsDisabled,
    updateProfile,
  } = useContext(SettingsContext);
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    async function init() {
      dispatch({ type: 'UPDATE_CONNECTION_STATUS', inSession: true, user_id: user.id });
      setInputs({
        firstName: user.firstName,
        lastName: user.lastName,
        birthdate: new Date(user.birthdate),
        gender: user.gender,
        sexualPreference: intToBitsArray(user.sexualPreference),
        description: user.description,
        interests: user.interests.map((interest) => interest.name),
      });
      dispatchPictures({
        type: 'initialisePictures',
        payload: {
          pictures: user.images,
        },
      });

      const labelPromises = [];
      user.locations.forEach((location) => {
        labelPromises.push(getLabelFromPos(location.latitude, location.longitude));
      });
      const labels = await Promise.all(labelPromises);
      const newLocations = user.locations.map((location, i) => ({
        ...location,
        label: labels[i],
      }));
      dispatchLocations({
        type: 'initialiseLocations',
        payload: {
          locations: newLocations,
        },
      });
    }
    init();
  }, []);

  useEffect(() => {
    console.log('pictures', pictures);
  }, [pictures]);

  const propsToPass = {
    generalProps: {
      inputs, setInputs, disabled: false, setDisabled: () => {},
    },
    picturesProps: {
      pictures, dispatchPictures, disabled: false, setDisabled: () => {},
    },
    locationProps: {
      locations, dispatchLocations, getLabelFromPos, disabled: false, setDisabled: () => {},
    },
  };

  const tabs = [
    {
      name: 'General',
      component: <GeneralSettings props={propsToPass.generalProps} />,
    },
    {
      name: 'Pictures',
      component: <PicturesSettings props={propsToPass.picturesProps} />,
    },
    {
      name: 'Locations',
      component: <LocationsSettings props={propsToPass.locationProps} />,

    },
  ];

  return (
    <Container maxWidth="md">
      <Typography variant="h6">SETTINGS</Typography>
      <Paper>
        <Tabs
          value={currentTab}
          indicatorColor="primary"
          textColor="primary"
          onChange={(e, val) => setCurrentTab(val)}
          className={classes.tabs}
          centered
        >
          {tabs.map((tab) => (
            <Tab key={tab.name} label={tab.name} />
          ))}
        </Tabs>

        <Paper elevation={0} className={classes.paper}>
          {tabs[currentTab].component}
        </Paper>

        <Paper elevation={0} className={`${classes.paper} ${classes.alignRight}`}>
          <Button
            disabled={generalDisabled || picturesDisabled || locationsDisabled}
            onClick={updateProfile}
            variant="contained"
            color="primary"
          >
            UPDATE
          </Button>
        </Paper>

      </Paper>
    </Container>
  );
}

SettingsPage.getInitialProps = async ({ req, res }) => {
  const apiObj = createApiRequester(req);
  const ret = await IsSessionAuthOnPage('private', apiObj);
  if (ret === false) {
    res.writeHead(302, {
      Location: '/signin',
    });
    res.end();
  }

  const u = await apiObj.get('users/getProfileInfo/current');
  const user = u.data;

  if (
    !user.firstName || !user.lastName || !user.birthdate || !user.gender
    || !user.sexualPreference || !user.description /** || !user.popularityScore */
  ) {
    res.writeHead(302, {
      Location: '/complete-profile',
    });
    res.end();
  }

  return ({ user });
};
