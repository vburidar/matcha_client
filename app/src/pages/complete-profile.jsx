import { useState, useReducer, useContext } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';

import {
  Container,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
} from '@material-ui/core';

import GeneralSettings from '../components/settings/GeneralSettings';
import PicturesSettings from '../components/settings/PicturesSettings';
import LocationSettings from '../components/settings/LocationSettings';

import { ApiContext } from '../api/Api';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  paper: {
    padding: theme.spacing(3),
  },
  alignRight: {
    textAlign: 'right',
  },
  previousButton: {
    marginRight: theme.spacing(2),
  },
}));

const alpha3toalpha2 = {
  AFG: 'AF', ALA: 'AX', ALB: 'AL', DZA: 'DZ', ASM: 'AS', AND: 'AD', AGO: 'AO', AIA: 'AI', ATA: 'AQ', ATG: 'AG', ARG: 'AR', ARM: 'AM', ABW: 'AW', AUS: 'AU', AUT: 'AT', AZE: 'AZ', BHS: 'BS', BHR: 'BH', BGD: 'BD', BRB: 'BB', BLR: 'BY', BEL: 'BE', BLZ: 'BZ', BEN: 'BJ', BMU: 'BM', BTN: 'BT', BOL: 'BO', BES: 'BQ', BIH: 'BA', BWA: 'BW', BVT: 'BV', BRA: 'BR', IOT: 'IO', BRN: 'BN', BGR: 'BG', BFA: 'BF', BDI: 'BI', CPV: 'CV', KHM: 'KH', CMR: 'CM', CAN: 'CA', CYM: 'KY', CAF: 'CF', TCD: 'TD', CHL: 'CL', CHN: 'CN', CXR: 'CX', CCK: 'CC', COL: 'CO', COM: 'KM', COD: 'CD', COG: 'CG', COK: 'CK', CRI: 'CR', CIV: 'CI', HRV: 'HR', CUB: 'CU', CUW: 'CW', CYP: 'CY', CZE: 'CZ', DNK: 'DK', DJI: 'DJ', DMA: 'DM', DOM: 'DO', ECU: 'EC', EGY: 'EG', SLV: 'SV', GNQ: 'GQ', ERI: 'ER', EST: 'EE', SWZ: 'SZ', ETH: 'ET', FLK: 'FK', FRO: 'FO', FJI: 'FJ', FIN: 'FI', FRA: 'FR', GUF: 'GF', PYF: 'PF', ATF: 'TF', GAB: 'GA', GMB: 'GM', GEO: 'GE', DEU: 'DE', GHA: 'GH', GIB: 'GI', GRC: 'GR', GRL: 'GL', GRD: 'GD', GLP: 'GP', GUM: 'GU', GTM: 'GT', GGY: 'GG', GIN: 'GN', GNB: 'GW', GUY: 'GY', HTI: 'HT', HMD: 'HM', VAT: 'VA', HND: 'HN', HKG: 'HK', HUN: 'HU', ISL: 'IS', IND: 'IN', IDN: 'ID', IRN: 'IR', IRQ: 'IQ', IRL: 'IE', IMN: 'IM', ISR: 'IL', ITA: 'IT', JAM: 'JM', JPN: 'JP', JEY: 'JE', JOR: 'JO', KAZ: 'KZ', KEN: 'KE', KIR: 'KI', PRK: 'KP', KOR: 'KR', KWT: 'KW', KGZ: 'KG', LAO: 'LA', LVA: 'LV', LBN: 'LB', LSO: 'LS', LBR: 'LR', LBY: 'LY', LIE: 'LI', LTU: 'LT', LUX: 'LU', MAC: 'MO', MKD: 'MK', MDG: 'MG', MWI: 'MW', MYS: 'MY', MDV: 'MV', MLI: 'ML', MLT: 'MT', MHL: 'MH', MTQ: 'MQ', MRT: 'MR', MUS: 'MU', MYT: 'YT', MEX: 'MX', FSM: 'FM', MDA: 'MD', MCO: 'MC', MNG: 'MN', MNE: 'ME', MSR: 'MS', MAR: 'MA', MOZ: 'MZ', MMR: 'MM', NAM: 'NA', NRU: 'NR', NPL: 'NP', NLD: 'NL', NCL: 'NC', NZL: 'NZ', NIC: 'NI', NER: 'NE', NGA: 'NG', NIU: 'NU', NFK: 'NF', MNP: 'MP', NOR: 'NO', OMN: 'OM', PAK: 'PK', PLW: 'PW', PSE: 'PS', PAN: 'PA', PNG: 'PG', PRY: 'PY', PER: 'PE', PHL: 'PH', PCN: 'PN', POL: 'PL', PRT: 'PT', PRI: 'PR', QAT: 'QA', REU: 'RE', ROU: 'RO', RUS: 'RU', RWA: 'RW', BLM: 'BL', SHN: 'SH', KNA: 'KN', LCA: 'LC', MAF: 'MF', SPM: 'PM', VCT: 'VC', WSM: 'WS', SMR: 'SM', STP: 'ST', SAU: 'SA', SEN: 'SN', SRB: 'RS', SYC: 'SC', SLE: 'SL', SGP: 'SG', SXM: 'SX', SVK: 'SK', SVN: 'SI', SLB: 'SB', SOM: 'SO', ZAF: 'ZA', SGS: 'GS', SSD: 'SS', ESP: 'ES', LKA: 'LK', SDN: 'SD', SUR: 'SR', SJM: 'SJ', SWE: 'SE', CHE: 'CH', SYR: 'SY', TWN: 'TW', TJK: 'TJ', TZA: 'TZ', THA: 'TH', TLS: 'TL', TGO: 'TG', TKL: 'TK', TON: 'TO', TTO: 'TT', TUN: 'TN', TUR: 'TR', TKM: 'TM', TCA: 'TC', TUV: 'TV', UGA: 'UG', UKR: 'UA', ARE: 'AE', GBR: 'GB', UMI: 'UM', USA: 'US', URY: 'UY', UZB: 'UZ', VUT: 'VU', VEN: 'VE', VNM: 'VN', VGB: 'VG', VIR: 'VI', WLF: 'WF', ESH: 'EH', YEM: 'YE', ZMB: 'ZM', ZWE: 'ZW',
};
function countryToFlag(a3Code) {
  const a2Code = alpha3toalpha2[a3Code];
  return typeof String.fromCodePoint !== 'undefined'
    ? a2Code.toUpperCase().replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    : a2Code;
}
async function getLabelFromPos(latitude, longitude) {
  const query = 'https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json'
    + `?apiKey=${process.env.HERE_API_KEY}`
    + `&prox=${latitude}%2C${longitude}%2C100`
    + '&mode=retrieveAreas'
    + '&maxresults=1'
    + '&jsonattributes=1';

  const res = await axios.get(query);

  if (!res.data.response) {
    throw new Error('Unable to get area from selected position');
  }
  const { country, city, district } = res.data.response.view[0].result[0].location.address;

  return `${countryToFlag(country)} ${city}, ${district}`;
}

function picturesReducer(state, action) {
  switch (action.type) {
    case 'addPicture':
      return [
        ...state,
        ...[{
          originalPicture: action.payload.originalPicture,
          croppedPicture: '',
          croppedAreaPixels: '',
          crop: { x: 0, y: 0 },
          zoom: 1,
          isProfile: (state.length === 0),
        }],
      ];
    case 'removePicture':
      return state
        .slice(0, action.payload.index)
        .concat(state.slice(action.payload.index + 1, state.length));
    case 'setAsProfile':
      return state.map((picture, index) => {
        if (index === action.payload.index) {
          return { ...picture, isProfile: true };
        }
        return { ...picture, isProfile: false };
      });
    case 'updateCroppedPicture':
      return state
        .slice(0, action.payload.index)
        .concat({
          ...state[action.payload.index],
          croppedPicture: action.payload.croppedPicture,
        })
        .concat(
          state.slice(action.payload.index + 1, state.length),
        );
    case 'updateCrop':
      return state
        .slice(0, action.payload.index)
        .concat({
          ...state[action.payload.index],
          crop: action.payload.crop,
        })
        .concat(
          state.slice(action.payload.index + 1, state.length),
        );
    case 'updateZoom':
      return state
        .slice(0, action.payload.index)
        .concat({
          ...state[action.payload.index],
          zoom: action.payload.zoom,
        })
        .concat(
          state.slice(action.payload.index + 1, state.length),
        );
    default:
      return state;
  }
}
function locationReducer(state, action) {
  switch (action.type) {
    case 'addLocation':
      return {
        ...state,
        label: action.payload.label,
        latitude: action.payload.latitude,
        longitude: action.payload.longitude,
        type: action.payload.type,
      };
    case 'updateLocationName':
      return {
        ...state,
        name: action.payload.name,
      };
    case 'resetLocation':
      return {
        ...state,
        label: '',
        latitude: 0,
        longitude: 0,
        type: 'custom',
      };
    default:
      return state;
  }
}

export default function CompleteProfilePage({ ipLocation }) {
  const { patchProfile } = useContext(ApiContext);
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [disabled, setDisabled] = useState(true);

  /** General settings form state */
  const [inputs, setInputs] = useState({
    birthdate: null,
    gender: '',
    sexualPreference: [],
    description: '',
    interests: [],
  });
  const [pictures, dispatchPictures] = useReducer(picturesReducer, []);
  const [location, dispatchLocation] = useReducer(locationReducer, {
    ...ipLocation,
    name: 'Default',
    type: 'ip',
    isActive: true,
  });

  const propsToPass = {
    generalProps: {
      inputs, setInputs, disabled, setDisabled,
    },
    picturesProps: {
      disabled, setDisabled, pictures, dispatchPictures,
    },
    locationProps: {
      getLabelFromPos, disabled, setDisabled, location, dispatchLocation,
    },
  };

  const steps = ({ generalProps, picturesProps, locationProps }) => [
    {
      name: 'General',
      component: <GeneralSettings props={generalProps} />,
    },
    {
      name: 'Pictures',
      component: <PicturesSettings props={picturesProps} />,
    },
    {
      name: 'Location',
      component: <LocationSettings props={locationProps} />,
    },
  ];

  const goToPrevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
      setDisabled(true);
    }
  };
  const goToNextStep = () => {
    if (activeStep + 1 < steps({}, {}, {}).length) {
      setActiveStep(activeStep + 1);
      setDisabled(true);
    }
  };

  const completeProfile = async () => {
    const data = {
      locations: [{
        latitude: location.latitude,
        longitude: location.longitude,
        name: location.name,
        isActive: location.isActive,
        type: location.type,
      }],
      pictures: pictures.map((pic) => ({ data: pic.croppedPicture, isProfile: pic.isProfile })),
      user: {
        birthdate: inputs.birthdate,
        gender: inputs.gender,
        sexualPreference: inputs.sexualPreference.reduce((acc, curr) => acc + curr, 0),
        description: inputs.description,
      },
      interests: inputs.interests,
    };

    await patchProfile(data);
  };

  return (
    <Container maxWidth="md" className={classes.container}>
      <Paper>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps(propsToPass).map(({ name }) => (
            <Step key={name}>
              <StepLabel>{name}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Paper elevation={0} className={classes.paper}>
          {steps(propsToPass)[activeStep].component}
        </Paper>
        <Paper elevation={0} className={`${classes.paper} ${classes.alignRight}`}>
          {activeStep > 0 && (
            <Button
              onClick={goToPrevStep}
              variant="contained"
              className={classes.previousButton}
            >
            PREVIOUS
            </Button>
          )}
          {activeStep < 2 && (
            <Button
              disabled={disabled}
              onClick={goToNextStep}
              variant="contained"
            >
            NEXT
            </Button>
          )}
          {activeStep === 2 && (
            <Button
              variant="contained"
              color="primary"
              disabled={false}
              onClick={completeProfile}
            >
            FINISH
            </Button>
          )}
        </Paper>
      </Paper>
    </Container>
  );
}

CompleteProfilePage.getInitialProps = async () => {
  try {
    const res = await axios('http://ip-api.com/json');
    const latitude = res.data.lat;
    const longitude = res.data.lon;
    const label = await getLabelFromPos(latitude, longitude);
    return {
      ipLocation: {
        label,
        latitude,
        longitude,
      },
    };
  } catch (err) {
    console.error(err.message);
    return {};
  }
};
