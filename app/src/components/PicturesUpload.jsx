import {
  useState, useReducer, useEffect, useCallback,
} from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Cropper from 'react-easy-crop';

import {
  Slider,
  Button,
  Card,
  CardActionArea,
  CardMedia,
  CardActions,
  Grid,
} from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';

import getCroppedImg from './cropImage';


const useStyles = makeStyles((theme) => ({
  cropContainer: {
    width: '100%',
    height: '300px',
    position: 'relative',
  },
  controls: {
    margin: 'auto',
    width: '50%',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
  },
  slider: {
    padding: '22px 0px',
  },
  input: {
    display: 'none',
  },
  dropzone: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px dashed',
    borderColor: theme.palette.primary.main,
    borderRadius: '5px',
    cursor: 'pointer',
    background: 'white',
    height: '300px',
  },
  card: {
    margin: theme.spacing(0, 0.5),
  },
}));

function reducer(state, action) {
  switch (action.type) {
    case 'addImage':
      return [
        ...state,
        ...[{
          originalImage: action.payload.originalImage,
          croppedImage: '',
          croppedAreaPixels: '',
          crop: { x: 0, y: 0 },
          zoom: 1,
        }],
      ];
    case 'updateCroppedImage':
      return state
        .slice(0, action.payload.index)
        .concat({
          ...state[action.payload.index],
          croppedImage: action.payload.croppedImage,
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

export default function PicturesUpload({
  props: {
    disabled, setDisabled,
  },
}) {
  const classes = useStyles();
  const [cropperData, setCropperData] = useState({
    crop: { x: 0, y: 0 },
    zoom: 1,
    isActive: false,
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [state, dispatch] = useReducer(reducer, []);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const showCroppedImage = useCallback(async () => {
    try {
      setCropperData({
        crop: { x: 0, y: 0 },
        zoom: 1,
        isActive: false,
      });

      const croppedImage = await getCroppedImg(
        state[currentImageIndex].originalImage,
        croppedAreaPixels,
      );

      dispatch({
        type: 'updateCroppedImage',
        payload: {
          index: currentImageIndex,
          croppedImage,
        },
      });
      setCurrentImageIndex(currentImageIndex + 1);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels]);

  const onCropComplete = (croppedArea, croppedAreaPixels2) => {
    setCroppedAreaPixels(croppedAreaPixels2);
  };

  const onCropChange = (crop) => {
    setCropperData({ ...cropperData, crop });
    dispatch({
      type: 'updateCrop',
      payload: {
        index: currentImageIndex,
        crop,
      },
    });
  };
  const onZoomChange = (zoom) => {
    setCropperData({ ...cropperData, zoom });
    dispatch({
      type: 'updateZoom',
      payload: {
        index: currentImageIndex,
        zoom,
      },
    });
  };

  const readFile = async (file) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const imageDataUrl = await readFile(e.target.files[0]);
      setCurrentImageIndex(state.length);
      dispatch({
        type: 'addImage',
        payload: {
          originalImage: imageDataUrl,
        },
      });
      setCropperData({
        ...cropperData,
        isActive: true,
      });
    }
  };

  const recrop = (index) => {
    setCurrentImageIndex(index);
    setCropperData({
      ...cropperData,
      isActive: true,
    });
  };

  useEffect(() => {
    const shouldBeDisabled = !(state.length > 0 && state[0].croppedImage);

    if (disabled !== shouldBeDisabled) {
      setDisabled(!disabled);
    }
  }, [state]);

  return (
    <div>
      {!cropperData.isActive && (
      <div>
        <label htmlFor="picture-upload" className={classes.dropzone}>
          <AddIcon style={{ fontSize: 60 }} />

          <input
            accept="image/*"
            className={classes.input}
            id="picture-upload"
            type="file"
            onChange={onFileChange}
          />
        </label>
        <div style={{ height: '33px' }} />
      </div>
      )}
      {cropperData.isActive && (
      <div>
        <div className={classes.cropContainer}>
          <Cropper
            image={state[currentImageIndex].originalImage}
            crop={state[currentImageIndex].crop}
            zoom={state[currentImageIndex].zoom}
            aspect={9 / 16}
            onCropChange={onCropChange} // Called every frame when dragging the frame
            onCropComplete={onCropComplete} // Called on mouseup after changing the frame
            onZoomChange={onZoomChange}
          />
        </div>
        <div className="controls">
          <Slider
            value={state[currentImageIndex].zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e, zoom) => onZoomChange(zoom)}
          />
        </div>
        <Button onClick={showCroppedImage}>UPLOAD</Button>
      </div>
      )}
      <Grid container className={classes.cardContainer} spacing={2} justify="center">
        {state.filter((el) => el.croppedImage !== '').map((el, key) => (
          <Grid key={key} item xs={6} sm={3}>
            <Card className={classes.card}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  alt="Contemplative Reptile"
                  image={el.croppedImage}
                  title="Contemplative Reptile"
                />
              </CardActionArea>
              <CardActions>
                {/* <Button size="small" color="primary">Set as profile</Button> */}
                <Button size="small" color="primary" onClick={() => recrop(key)}>Recrop</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
