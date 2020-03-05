import router from 'next/router';
import {
  useState, useReducer, useContext, createContext, useEffect,
} from 'react';
import axios from 'axios';
import { subYears, compareAsc, compareDesc } from 'date-fns';

import { ApiContext } from './Api';

function picturesReducer(state, action) {
  switch (action.type) {
    case 'initialisePictures':
      return action.payload.pictures.map((picture) => ({
        originalPicture: picture.path,
        croppedPicture: picture.path || '',
        croppedAreaPixels: '',
        crop: { x: 0, y: 0 },
        zoom: 1,
        isProfile: picture.isProfile,
      }));
    case 'addPicture':
      return [
        ...state,
        ...[{
          originalPicture: action.payload.originalPicture,
          croppedPicture: action.payload.croppedPicture || '',
          croppedAreaPixels: '',
          crop: { x: 0, y: 0 },
          zoom: 1,
          isProfile: (state.length === 0),
        }],
      ];
    case 'removePicture':
      return state
        .slice(0, action.payload.index)
        .concat(state.slice(action.payload.index + 1));
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
          state.slice(action.payload.index + 1),
        );
    case 'updateCrop':
      return state
        .slice(0, action.payload.index)
        .concat({
          ...state[action.payload.index],
          crop: action.payload.crop,
        })
        .concat(
          state.slice(action.payload.index + 1),
        );
    case 'updateZoom':
      return state
        .slice(0, action.payload.index)
        .concat({
          ...state[action.payload.index],
          zoom: action.payload.zoom,
        })
        .concat(
          state.slice(action.payload.index + 1),
        );
    default:
      return state;
  }
}

function locationsReducer(state, action) {
  switch (action.type) {
    case 'initialiseLocations':
      return action.payload.locations.map((location) => ({
        ...location,
      }));
    case 'addLocation':
      return state.concat({
        name: 'Default',
        label: action.payload.label,
        latitude: action.payload.latitude,
        longitude: action.payload.longitude,
        type: action.payload.type,
        isActive: action.payload.isActive || false,
      });
    case 'updateLocationName':
      return state
        .slice(0, action.payload.index)
        .concat({
          ...state[action.payload.index],
          name: action.payload.name,
        })
        .concat(state.slice(action.payload.index + 1));
    case 'updateLocation':
      return state
        .slice(0, action.payload.index)
        .concat({
          ...state[action.payload.index],
          label: action.payload.label,
          latitude: action.payload.latitude,
          longitude: action.payload.longitude,
          type: action.payload.type,
          isActive: action.payload.isActive || state[action.payload.index].isActive,
        })
        .concat(state.slice(action.payload.index + 1));
    case 'resetLocation':
      return state
        .slice(0, action.payload.index)
        .concat({
          ...state[action.payload.index],
          label: '',
          latitude: 0,
          longitude: 0,
          type: 'custom',
        })
        .concat(state.slice(action.payload.index + 1));
    default:
      return state;
  }
}

function errorsReducer(state, action) {
  switch (action.type) {
    case 'setCredentials':
      return {
        ...state,
        login: action.login,
        email: action.email,
        emailConfirmation: action.emailConfirmation,
      };
    case 'setGeneral':
      return {
        ...state,
        firstName: action.firstName,
        lastName: action.lastName,
        birthdate: action.birthdate,
        interests: action.interests,
      };
    case 'setLocations':
      return {
        ...state,
        location: action.location,
        locationName: action.locationName,
      };
    default:
      return state;
  }
}

const alpha3toalpha2 = {
  AFG: 'AF', ALA: 'AX', ALB: 'AL', DZA: 'DZ', ASM: 'AS', AND: 'AD', AGO: 'AO', AIA: 'AI', ATA: 'AQ', ATG: 'AG', ARG: 'AR', ARM: 'AM', ABW: 'AW', AUS: 'AU', AUT: 'AT', AZE: 'AZ', BHS: 'BS', BHR: 'BH', BGD: 'BD', BRB: 'BB', BLR: 'BY', BEL: 'BE', BLZ: 'BZ', BEN: 'BJ', BMU: 'BM', BTN: 'BT', BOL: 'BO', BES: 'BQ', BIH: 'BA', BWA: 'BW', BVT: 'BV', BRA: 'BR', IOT: 'IO', BRN: 'BN', BGR: 'BG', BFA: 'BF', BDI: 'BI', CPV: 'CV', KHM: 'KH', CMR: 'CM', CAN: 'CA', CYM: 'KY', CAF: 'CF', TCD: 'TD', CHL: 'CL', CHN: 'CN', CXR: 'CX', CCK: 'CC', COL: 'CO', COM: 'KM', COD: 'CD', COG: 'CG', COK: 'CK', CRI: 'CR', CIV: 'CI', HRV: 'HR', CUB: 'CU', CUW: 'CW', CYP: 'CY', CZE: 'CZ', DNK: 'DK', DJI: 'DJ', DMA: 'DM', DOM: 'DO', ECU: 'EC', EGY: 'EG', SLV: 'SV', GNQ: 'GQ', ERI: 'ER', EST: 'EE', SWZ: 'SZ', ETH: 'ET', FLK: 'FK', FRO: 'FO', FJI: 'FJ', FIN: 'FI', FRA: 'FR', GUF: 'GF', PYF: 'PF', ATF: 'TF', GAB: 'GA', GMB: 'GM', GEO: 'GE', DEU: 'DE', GHA: 'GH', GIB: 'GI', GRC: 'GR', GRL: 'GL', GRD: 'GD', GLP: 'GP', GUM: 'GU', GTM: 'GT', GGY: 'GG', GIN: 'GN', GNB: 'GW', GUY: 'GY', HTI: 'HT', HMD: 'HM', VAT: 'VA', HND: 'HN', HKG: 'HK', HUN: 'HU', ISL: 'IS', IND: 'IN', IDN: 'ID', IRN: 'IR', IRQ: 'IQ', IRL: 'IE', IMN: 'IM', ISR: 'IL', ITA: 'IT', JAM: 'JM', JPN: 'JP', JEY: 'JE', JOR: 'JO', KAZ: 'KZ', KEN: 'KE', KIR: 'KI', PRK: 'KP', KOR: 'KR', KWT: 'KW', KGZ: 'KG', LAO: 'LA', LVA: 'LV', LBN: 'LB', LSO: 'LS', LBR: 'LR', LBY: 'LY', LIE: 'LI', LTU: 'LT', LUX: 'LU', MAC: 'MO', MKD: 'MK', MDG: 'MG', MWI: 'MW', MYS: 'MY', MDV: 'MV', MLI: 'ML', MLT: 'MT', MHL: 'MH', MTQ: 'MQ', MRT: 'MR', MUS: 'MU', MYT: 'YT', MEX: 'MX', FSM: 'FM', MDA: 'MD', MCO: 'MC', MNG: 'MN', MNE: 'ME', MSR: 'MS', MAR: 'MA', MOZ: 'MZ', MMR: 'MM', NAM: 'NA', NRU: 'NR', NPL: 'NP', NLD: 'NL', NCL: 'NC', NZL: 'NZ', NIC: 'NI', NER: 'NE', NGA: 'NG', NIU: 'NU', NFK: 'NF', MNP: 'MP', NOR: 'NO', OMN: 'OM', PAK: 'PK', PLW: 'PW', PSE: 'PS', PAN: 'PA', PNG: 'PG', PRY: 'PY', PER: 'PE', PHL: 'PH', PCN: 'PN', POL: 'PL', PRT: 'PT', PRI: 'PR', QAT: 'QA', REU: 'RE', ROU: 'RO', RUS: 'RU', RWA: 'RW', BLM: 'BL', SHN: 'SH', KNA: 'KN', LCA: 'LC', MAF: 'MF', SPM: 'PM', VCT: 'VC', WSM: 'WS', SMR: 'SM', STP: 'ST', SAU: 'SA', SEN: 'SN', SRB: 'RS', SYC: 'SC', SLE: 'SL', SGP: 'SG', SXM: 'SX', SVK: 'SK', SVN: 'SI', SLB: 'SB', SOM: 'SO', ZAF: 'ZA', SGS: 'GS', SSD: 'SS', ESP: 'ES', LKA: 'LK', SDN: 'SD', SUR: 'SR', SJM: 'SJ', SWE: 'SE', CHE: 'CH', SYR: 'SY', TWN: 'TW', TJK: 'TJ', TZA: 'TZ', THA: 'TH', TLS: 'TL', TGO: 'TG', TKL: 'TK', TON: 'TO', TTO: 'TT', TUN: 'TN', TUR: 'TR', TKM: 'TM', TCA: 'TC', TUV: 'TV', UGA: 'UG', UKR: 'UA', ARE: 'AE', GBR: 'GB', UMI: 'UM', USA: 'US', URY: 'UY', UZB: 'UZ', VUT: 'VU', VEN: 'VE', VNM: 'VN', VGB: 'VG', VIR: 'VI', WLF: 'WF', ESH: 'EH', YEM: 'YE', ZMB: 'ZM', ZWE: 'ZW',
};
export function countryToFlag(a3Code) {
  const a2Code = alpha3toalpha2[a3Code];
  return typeof String.fromCodePoint !== 'undefined'
    ? a2Code.toUpperCase().replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    : a2Code;
}
export async function getLabelFromPos(latitude, longitude) {
  const query = 'https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json'
    + `?apiKey=${process.env.HERE_API_KEY}`
    + `&prox=${latitude}%2C${longitude}%2C100`
    + '&mode=retrieveAddresses'
    + '&maxresults=1'
    + '&jsonattributes=1';

  const res = await axios.get(query);
  if (!res.data.response) {
    throw new Error('Unable to get area from selected position');
  }

  const {
    country, city, district, street,
  } = res.data.response.view[0].result[0].location.address;

  let complementaryAddress = district || street || '';
  complementaryAddress = (complementaryAddress !== '') ? `, ${complementaryAddress}` : '';

  return `${countryToFlag(country)} ${city}${complementaryAddress}`;
}

const genders = [
  {
    name: 'Man',
    value: 1,
  },
  {
    name: 'Woman',
    value: 2,
  },
  {
    name: 'Gender Queer',
    value: 4,
  },
  {
    name: 'Gender Fluid',
    value: 8,
  },
];

export const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const { patchProfile } = useContext(ApiContext);

  const [credentials, setCredentials] = useState({
    login: '',
    email: '',
    emailConfirmation: '',
  });

  const [inputs, setInputs] = useState({
    firstName: '',
    lastName: '',
    birthdate: null,
    gender: '',
    sexualPreference: [],
    description: '',
    interests: [],
  });

  const [pictures, dispatchPictures] = useReducer(picturesReducer, []);

  const [locations, dispatchLocations] = useReducer(locationsReducer, []);

  const [credentialsDisabled, setCredentialsDisabled] = useState(true);
  const [generalDisabled, setGeneralDisabled] = useState(true);
  const [picturesDisabled, setPicturesDisabled] = useState(true);
  const [locationsDisabled, setLocationsDisabled] = useState(true);

  const [errors, dispatchErrors] = useReducer(errorsReducer, {
    login: false,
    email: false,
    emailConfirmation: false,
    firstName: false,
    lastName: false,
    birthdate: false,
    gender: false,
    description: false,
    interests: false,
    location: false,
    locationName: false,
  });

  async function updateProfile() {
    const data = {
      locations,
      pictures: pictures.map((pic) => ({ data: pic.croppedPicture, isProfile: pic.isProfile })),
      user: {
        login: credentials.login || null,
        email: (credentials.emailConfirmation) ? credentials.email : null,
        firstName: inputs.firstName,
        lastName: inputs.lastName,
        birthdate: inputs.birthdate,
        gender: inputs.gender,
        sexualPreference: (inputs.sexualPreference.length > 0)
          ? inputs.sexualPreference.reduce((acc, curr) => acc + curr, 0)
          : 15,
        description: inputs.description,
      },
      interests: inputs.interests,
    };

    if (data.user.email === null) delete data.user.email;
    if (data.user.login === null) delete data.user.login;

    await patchProfile(data);
    router.push('/');
  }

  const value = {
    credentials,
    setCredentials,
    inputs,
    setInputs,
    pictures,
    dispatchPictures,
    locations,
    dispatchLocations,
    credentialsDisabled,
    generalDisabled,
    picturesDisabled,
    locationsDisabled,
    errors,
    getLabelFromPos,
    updateProfile,
  };

  useEffect(() => {
    let shouldBeDisabled = false;
    if (
      /^([a-zA-Z0-9]|_){2,20}$/.test(credentials.login) === false
      || (credentials.emailConfirmation.trim() !== ''
        && (credentials.email !== credentials.emailConfirmation
          || /\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/.test(credentials.email) === false))
    ) {
      shouldBeDisabled = true;
    }

    if (credentialsDisabled !== shouldBeDisabled) {
      setCredentialsDisabled(!credentialsDisabled);
    }

    dispatchErrors({
      type: 'setCredentials',
      login: /^([a-zA-Z0-9]|_){2,20}$/.test(credentials.login) === false,
      email:
        credentials.emailConfirmation.trim() !== ''
        && /\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/.test(credentials.email) === false,
      emailConfirmation:
        credentials.emailConfirmation.trim() !== ''
        && credentials.email !== credentials.emailConfirmation,
    });
  }, [credentials]);

  useEffect(() => {
    let shouldBeDisabled = false;
    if (
      /^([a-zA-Z]|-|\.|\s){2,20}$/.test(inputs.firstName) === false
      || /^([a-zA-Z]|-|\.|\s){2,20}$/.test(inputs.lastName) === false
      || inputs.birthdate === null || Number.isNaN(inputs.birthdate.getTime())
      || compareAsc(subYears(new Date(), 18), inputs.birthdate) === -1
      || compareDesc(subYears(new Date(), 80), inputs.birthdate) === -1
      || genders.findIndex((el) => el.value === inputs.gender) === -1
      || inputs.description.trim() === ''
      || inputs.interests.length < 3 || inputs.interests.length > 7
    ) {
      shouldBeDisabled = true;
    }

    if (generalDisabled !== shouldBeDisabled) {
      setGeneralDisabled(!generalDisabled);
    }

    dispatchErrors({
      type: 'setGeneral',
      firstName: /^([a-zA-Z]|-|\.|\s){2,20}$/.test(inputs.firstName) === false,
      lastName: /^([a-zA-Z]|-|\.|\s){2,20}$/.test(inputs.lastName) === false,
      birthdate: inputs.birthdate === null
        || Number.isNaN(inputs.birthdate.getTime())
        || compareAsc(subYears(new Date(), 18), inputs.birthdate) === -1
        || compareDesc(subYears(new Date(), 80), inputs.birthdate) === -1,
      interests: inputs.interests.length < 3 || inputs.interests.length > 7,
    });
  }, [inputs]);

  useEffect(() => {
    let shouldBeDisabled = false;
    if (
      pictures.length === 0
      || !pictures[0].croppedPicture
      || pictures.filter((picture) => picture.isProfile).length !== 1
    ) {
      shouldBeDisabled = true;
    }

    if (picturesDisabled !== shouldBeDisabled) {
      setPicturesDisabled(!picturesDisabled);
    }
  }, [pictures]);

  useEffect(() => {
    let shouldBeDisabled = false;
    if (
      locations.length === 0
      || locations.filter((location) => (location.latitude === 0 && location.longitude === 0)
        || /^([a-zA-Z]|-|\.|\s){2,20}$/.test(location.name) === false).length > 0
      || locations.filter((location) => location.isActive).length !== 1
    ) {
      shouldBeDisabled = true;
    }

    if (locationsDisabled !== shouldBeDisabled) {
      setLocationsDisabled(!locationsDisabled);
    }

    dispatchErrors({
      type: 'setLocations',
      locationName: locations.filter(
        (location) => /^([a-zA-Z]|-|\.|\s){2,20}$/.test(location.name) === false,
      ).length > 0,
      location: locations.filter(
        (location) => (location.latitude === 0 && location.longitude === 0),
      ).length > 0,
    });
  }, [locations]);

  useEffect(() => {
    console.log('errors', errors);
  }, [errors]);

  useEffect(() => {
    console.log('disabgbled', generalDisabled, picturesDisabled, locationsDisabled);
  }, [generalDisabled, picturesDisabled, locationsDisabled]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}
