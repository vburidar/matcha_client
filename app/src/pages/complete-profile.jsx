import { useState } from 'react';
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

import GeneralSettingsForm from '../components/GeneralSettingsForm';
import PicturesUpload from '../components/PicturesUpload';
import LocationStep from '../components/LocationStep';

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

  const { country, city, district } = res.data.response.view[0].result[0].location.address;

  return `${countryToFlag(country)} ${city}, ${district}`;
}

export default function CompleteProfilePage({ ipLocation }) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [disabled, setDisabled] = useState(true);

  /** General settings form state */
  const [inputs, setInputs] = useState({
    birthdate: null,
    gender: '',
    sexualOrientation: [],
    description: '',
    interests: [],
  });

  const propsToPass = {
    generalProps: {
      inputs, setInputs, disabled, setDisabled,
    },
    picturesProps: {
      disabled, setDisabled,
    },
    locationProps: {
      ipLocation, getLabelFromPos,
    },
  };

  const steps = ({ generalProps, picturesProps, locationProps }) => [
    {
      name: 'Location',
      component: <LocationStep props={locationProps} />,
    },
    {
      name: 'General',
      component: <GeneralSettingsForm props={generalProps} />,
    },
    {
      name: 'Pictures',
      component: <PicturesUpload props={picturesProps} />,
    },
  ];

  const goToPrevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
      setDisabled(true);
    }
  };
  const goToNextStep = () => {
    if (activeStep + 1 < steps({}, {}, {}).length - 1) {
      setActiveStep(activeStep + 1);
      setDisabled(true);
    }
  };

  const completeProfile = async () => {
    console.log('completeProfile');
    console.log(inputs);
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
          {/* <div> */}
          {steps(propsToPass)[activeStep].component}
          {/* </div> */}
        </Paper>
        <Paper elevation={0} className={`${classes.paper} ${classes.alignRight}`}>
          {activeStep > 0 && (
          <Button
            // disabled={disabled}
            onClick={goToPrevStep}
          >
            PREVIOUS
          </Button>
          )}
          {activeStep < 2 && (
            <Button
              // disabled={disabled}
              onClick={goToNextStep}
            >
            NEXT
            </Button>
          )}
          {/* {activeStep === 2 && ( */}
          <Button
            variant="contained"
            color="primary"
            disabled={false}
            onClick={completeProfile}
          >
            FINISH
          </Button>
          {/* )} */}
        </Paper>
      </Paper>
    </Container>
  );
}

CompleteProfilePage.getInitialProps = async () => {
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
};
