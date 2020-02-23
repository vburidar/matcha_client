import { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

import {
  TextField,
  Grid,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { StoreContext } from '../../store/Store';
import { newNotification } from '../../store/actions';

import { SettingsContext } from '../../stores/Settings';

const alpha3toalpha2 = {
  AFG: 'AF',
  ALA: 'AX',
  ALB: 'AL',
  DZA: 'DZ',
  ASM: 'AS',
  AND: 'AD',
  AGO: 'AO',
  AIA: 'AI',
  ATA: 'AQ',
  ATG: 'AG',
  ARG: 'AR',
  ARM: 'AM',
  ABW: 'AW',
  AUS: 'AU',
  AUT: 'AT',
  AZE: 'AZ',
  BHS: 'BS',
  BHR: 'BH',
  BGD: 'BD',
  BRB: 'BB',
  BLR: 'BY',
  BEL: 'BE',
  BLZ: 'BZ',
  BEN: 'BJ',
  BMU: 'BM',
  BTN: 'BT',
  BOL: 'BO',
  BES: 'BQ',
  BIH: 'BA',
  BWA: 'BW',
  BVT: 'BV',
  BRA: 'BR',
  IOT: 'IO',
  BRN: 'BN',
  BGR: 'BG',
  BFA: 'BF',
  BDI: 'BI',
  CPV: 'CV',
  KHM: 'KH',
  CMR: 'CM',
  CAN: 'CA',
  CYM: 'KY',
  CAF: 'CF',
  TCD: 'TD',
  CHL: 'CL',
  CHN: 'CN',
  CXR: 'CX',
  CCK: 'CC',
  COL: 'CO',
  COM: 'KM',
  COD: 'CD',
  COG: 'CG',
  COK: 'CK',
  CRI: 'CR',
  CIV: 'CI',
  HRV: 'HR',
  CUB: 'CU',
  CUW: 'CW',
  CYP: 'CY',
  CZE: 'CZ',
  DNK: 'DK',
  DJI: 'DJ',
  DMA: 'DM',
  DOM: 'DO',
  ECU: 'EC',
  EGY: 'EG',
  SLV: 'SV',
  GNQ: 'GQ',
  ERI: 'ER',
  EST: 'EE',
  SWZ: 'SZ',
  ETH: 'ET',
  FLK: 'FK',
  FRO: 'FO',
  FJI: 'FJ',
  FIN: 'FI',
  FRA: 'FR',
  GUF: 'GF',
  PYF: 'PF',
  ATF: 'TF',
  GAB: 'GA',
  GMB: 'GM',
  GEO: 'GE',
  DEU: 'DE',
  GHA: 'GH',
  GIB: 'GI',
  GRC: 'GR',
  GRL: 'GL',
  GRD: 'GD',
  GLP: 'GP',
  GUM: 'GU',
  GTM: 'GT',
  GGY: 'GG',
  GIN: 'GN',
  GNB: 'GW',
  GUY: 'GY',
  HTI: 'HT',
  HMD: 'HM',
  VAT: 'VA',
  HND: 'HN',
  HKG: 'HK',
  HUN: 'HU',
  ISL: 'IS',
  IND: 'IN',
  IDN: 'ID',
  IRN: 'IR',
  IRQ: 'IQ',
  IRL: 'IE',
  IMN: 'IM',
  ISR: 'IL',
  ITA: 'IT',
  JAM: 'JM',
  JPN: 'JP',
  JEY: 'JE',
  JOR: 'JO',
  KAZ: 'KZ',
  KEN: 'KE',
  KIR: 'KI',
  PRK: 'KP',
  KOR: 'KR',
  KWT: 'KW',
  KGZ: 'KG',
  LAO: 'LA',
  LVA: 'LV',
  LBN: 'LB',
  LSO: 'LS',
  LBR: 'LR',
  LBY: 'LY',
  LIE: 'LI',
  LTU: 'LT',
  LUX: 'LU',
  MAC: 'MO',
  MKD: 'MK',
  MDG: 'MG',
  MWI: 'MW',
  MYS: 'MY',
  MDV: 'MV',
  MLI: 'ML',
  MLT: 'MT',
  MHL: 'MH',
  MTQ: 'MQ',
  MRT: 'MR',
  MUS: 'MU',
  MYT: 'YT',
  MEX: 'MX',
  FSM: 'FM',
  MDA: 'MD',
  MCO: 'MC',
  MNG: 'MN',
  MNE: 'ME',
  MSR: 'MS',
  MAR: 'MA',
  MOZ: 'MZ',
  MMR: 'MM',
  NAM: 'NA',
  NRU: 'NR',
  NPL: 'NP',
  NLD: 'NL',
  NCL: 'NC',
  NZL: 'NZ',
  NIC: 'NI',
  NER: 'NE',
  NGA: 'NG',
  NIU: 'NU',
  NFK: 'NF',
  MNP: 'MP',
  NOR: 'NO',
  OMN: 'OM',
  PAK: 'PK',
  PLW: 'PW',
  PSE: 'PS',
  PAN: 'PA',
  PNG: 'PG',
  PRY: 'PY',
  PER: 'PE',
  PHL: 'PH',
  PCN: 'PN',
  POL: 'PL',
  PRT: 'PT',
  PRI: 'PR',
  QAT: 'QA',
  REU: 'RE',
  ROU: 'RO',
  RUS: 'RU',
  RWA: 'RW',
  BLM: 'BL',
  SHN: 'SH',
  KNA: 'KN',
  LCA: 'LC',
  MAF: 'MF',
  SPM: 'PM',
  VCT: 'VC',
  WSM: 'WS',
  SMR: 'SM',
  STP: 'ST',
  SAU: 'SA',
  SEN: 'SN',
  SRB: 'RS',
  SYC: 'SC',
  SLE: 'SL',
  SGP: 'SG',
  SXM: 'SX',
  SVK: 'SK',
  SVN: 'SI',
  SLB: 'SB',
  SOM: 'SO',
  ZAF: 'ZA',
  SGS: 'GS',
  SSD: 'SS',
  ESP: 'ES',
  LKA: 'LK',
  SDN: 'SD',
  SUR: 'SR',
  SJM: 'SJ',
  SWE: 'SE',
  CHE: 'CH',
  SYR: 'SY',
  TWN: 'TW',
  TJK: 'TJ',
  TZA: 'TZ',
  THA: 'TH',
  TLS: 'TL',
  TGO: 'TG',
  TKL: 'TK',
  TON: 'TO',
  TTO: 'TT',
  TUN: 'TN',
  TUR: 'TR',
  TKM: 'TM',
  TCA: 'TC',
  TUV: 'TV',
  UGA: 'UG',
  UKR: 'UA',
  ARE: 'AE',
  GBR: 'GB',
  UMI: 'UM',
  USA: 'US',
  URY: 'UY',
  UZB: 'UZ',
  VUT: 'VU',
  VEN: 'VE',
  VNM: 'VN',
  VGB: 'VG',
  VIR: 'VI',
  WLF: 'WF',
  ESH: 'EH',
  YEM: 'YE',
  ZMB: 'ZM',
  ZWE: 'ZW',
};

export default function SingleLocation({ index, disabled }) {
  const { dispatch } = useContext(StoreContext);
  const { locations, dispatchLocations } = useContext(SettingsContext);
  const [timeoutId, setTimeoutId] = useState(-1);
  const [locationSuggestions, setLocationSuggestions] = useState([locations[index]]);

  function countryToFlag(a3Code) {
    const a2Code = alpha3toalpha2[a3Code];
    return typeof String.fromCodePoint !== 'undefined'
      ? a2Code.toUpperCase().replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
      : a2Code;
  }

  async function getLocationSuggestions(queryText) {
    try {
      if (queryText.trim() === '') {
        return setLocationSuggestions([]);
      }

      const query = 'https://autocomplete.geocoder.ls.hereapi.com/6.2/suggest.json'
          + `?apiKey=${process.env.HERE_API_KEY}`
          + `&query=${queryText}`
          + '&maxresults=10';

      const res = await axios.get(query);
      let { suggestions } = res.data;

      suggestions = suggestions
        .filter((el) => (
          ['houseNumber', 'intersection', 'street', 'postalCode', 'district'].indexOf(el.matchLevel) > -1
        ))
        .map((suggestion) => ({
          label: `${countryToFlag(suggestion.countryCode)} ${suggestion.label.split(',').slice(1).join(',')}`,
          locationId: suggestion.locationId,
          latitude: 0,
          longitude: 0,
        }));

      return setLocationSuggestions(suggestions);
    } catch (err) {
      return newNotification(dispatch, { message: err.message, severity: 'error' });
    }
  }

  function clearAutocomplete() {
    dispatchLocations({ type: 'resetLocation', payload: { index } });
    setLocationSuggestions([]);
  }

  async function selectLocation(selectedSuggestion) {
    try {
      if (selectedSuggestion !== null) {
        const query = 'https://geocoder.ls.hereapi.com/6.2/geocode.json'
          + `?apiKey=${process.env.HERE_API_KEY}`
          + `&locationid=${selectedSuggestion.locationId}`
          + '&jsonattributes=1';

        const res = await axios.get(query);

        if (!res.data.response.view.length === 0) {
          throw new Error('Unable to get area suggestions');
        }

        const [latitude, longitude] = [
          res.data.response.view[0].result[0].location.displayPosition.latitude,
          res.data.response.view[0].result[0].location.displayPosition.longitude,
        ];

        dispatchLocations({
          type: 'updateLocation',
          payload: {
            label: selectedSuggestion.label,
            latitude,
            longitude,
            type: 'custom',
            index,
          },
        });
      }
    } catch (err) {
      newNotification(dispatch, { message: err.message, severity: 'error' });
    }
  }

  function handleOnChange(e, value) {
    if (value === null) {
      clearAutocomplete();
    } else {
      selectLocation(value);
    }
  }
  function handleOnInputChange(e, value, reason) {
    if (reason === 'input') {
      dispatchLocations({
        type: 'updateLocation',
        payload: {
          label: value,
          latitude: 0,
          longitude: 0,
          type: 'custom',
          index,
        },
      });
    }
  }

  useEffect(() => {
    if (timeoutId !== -1) {
      clearTimeout(timeoutId);
      setTimeoutId(-1);
    }

    setTimeoutId(
      setTimeout(() => {
        if (locations[index].latitude === 0 && locations[index].longitude === 0) {
          getLocationSuggestions(locations[index].label);
          setTimeoutId(-1);
        }
      }, 400),
    );
  }, [locations[index].label]);

  return (
    <Grid container spacing={2} justify="center" alignItems="center">
      <Grid item xs={12} sm>
        <TextField
          id="location-name"
          label="Location Name"
          fullWidth
          disabled={disabled}
          value={locations[index].name}
          onChange={(e) => dispatchLocations({
            type: 'updateLocationName',
            payload: {
              name: e.target.value,
              index,
            },
          })}
        />
      </Grid>

      <Grid item xs={12} sm>
        <Autocomplete
          id="location"
          disabled={disabled}
          options={locationSuggestions}
          autoHighlight
          value={locations[index]}
          onInputChange={handleOnInputChange}
          onChange={handleOnChange}
          getOptionLabel={(suggestion) => suggestion.label}
          renderOption={(suggestion) => (
            <>
              <span>{suggestion.label}</span>
            </>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Choose a place"
              fullWidth
            />
          )}
        />
      </Grid>
    </Grid>
  );
}
