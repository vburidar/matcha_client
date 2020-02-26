import {
  useState, useReducer, useEffect, useCallback,
} from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Cropper from 'react-easy-crop';

import {
  Slider,
  Button,
  Card,
  CardMedia,
  CardActions,
  Grid,
  IconButton,
  Tooltip,
  Box,
  Typography,
} from '@material-ui/core';

import CropIcon from '@material-ui/icons/Crop';
import FaceIcon from '@material-ui/icons/Face';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

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
  marginLeftAuto: {
    marginLeft: 'auto',
  },
  order1: {
    order: 1,
  },
  order2: {
    order: 2,
  },
  order3: {
    order: 3,
  },
}));

function createImageAsync(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });
}

async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await createImageAsync(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(image, -pixelCrop.x, -pixelCrop.y);

  const data = ctx.getImageData(0, 0, image.width, image.height);

  ctx.putImageData(data, 0, 0);

  return canvas.toDataURL('image/jpeg');
}

export default function PicturesSettings({
  props: {
    pictures, dispatchPictures,
  },
}) {
  const classes = useStyles();
  const [cropperData, setCropperData] = useState({
    crop: { x: 0, y: 0 },
    zoom: 1,
    isActive: false,
  });
  const [currentPictureIndex, setCurrentPictureIndex] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const showCroppedPicture = useCallback(async () => {
    try {
      setCropperData({
        crop: { x: 0, y: 0 },
        zoom: 1,
        isActive: false,
      });

      const croppedPicture = await getCroppedImg(
        pictures[currentPictureIndex].originalPicture,
        croppedAreaPixels,
      );

      dispatchPictures({
        type: 'updateCroppedPicture',
        payload: {
          index: currentPictureIndex,
          croppedPicture,
        },
      });
      setCurrentPictureIndex(currentPictureIndex + 1);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels]);

  const onCropComplete = (croppedArea, croppedAreaPixels2) => {
    setCroppedAreaPixels(croppedAreaPixels2);
  };

  const onCropChange = (crop) => {
    setCropperData({ ...cropperData, crop });
    dispatchPictures({
      type: 'updateCrop',
      payload: {
        index: currentPictureIndex,
        crop,
      },
    });
  };
  const onZoomChange = (zoom) => {
    setCropperData({ ...cropperData, zoom });
    dispatchPictures({
      type: 'updateZoom',
      payload: {
        index: currentPictureIndex,
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
      const pictureDataUrl = await readFile(e.target.files[0]);
      setCurrentPictureIndex(pictures.length);
      dispatchPictures({
        type: 'addPicture',
        payload: {
          originalPicture: pictureDataUrl,
        },
      });
      setCropperData({
        ...cropperData,
        isActive: true,
      });
    }
  };

  const crop = (index) => {
    setCurrentPictureIndex(index);
    setCropperData({
      ...cropperData,
      isActive: true,
    });
  };

  const removePicture = (index) => {
    setCropperData({
      ...cropperData,
      isActive: false,
    });
    dispatchPictures({
      type: 'removePicture',
      payload: { index },
    });
  };

  // useEffect(() => {
  //   const shouldBeDisabled = !(pictures.length > 0 && pictures[0].croppedPicture);

  //   if (disabled !== shouldBeDisabled) {
  //     setDisabled(!disabled);
  //   }
  // }, [pictures]);

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
            image={pictures[currentPictureIndex].originalPicture}
            crop={pictures[currentPictureIndex].crop}
            zoom={pictures[currentPictureIndex].zoom}
            aspect={1}
            onCropChange={onCropChange} // Called every frame when dragging the frame
            onCropComplete={onCropComplete} // Called on mouseup after changing the frame
            onZoomChange={onZoomChange}
          />
        </div>
        <div className="controls">
          <Slider
            value={pictures[currentPictureIndex].zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e, zoom) => onZoomChange(zoom)}
          />
        </div>
        <Button onClick={showCroppedPicture}>UPLOAD</Button>
      </div>
      )}
      <Grid container display="flex" spacing={2} justify="center">
        {pictures.filter((picture) => picture.croppedPicture !== '').map((picture, key) => (
          <Grid
            key={key}
            item
            xs={6}
            sm={3}
            className={picture.isProfile ? classes.order1 : classes.order3}
          >
            <Card className={classes.card}>
              <CardMedia
                component="img"
                alt="Contemplative Reptile"
                image={picture.croppedPicture}
                title="Contemplative Reptile"
              />
              <CardActions disableSpacing>
                <Tooltip title="Crop">
                  <span>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => crop(key)}
                      disabled={/^data:image\/(png|jpeg|gif);base64,/.test(picture.croppedPicture) === false}
                    >
                      <CropIcon />
                    </IconButton>
                  </span>
                </Tooltip>

                {!picture.isProfile && (
                <Tooltip title="Set as profile" className={classes.marginLeftAuto}>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => dispatchPictures({
                      type: 'setAsProfile',
                      payload: { index: key },
                    })}
                  >
                    <FaceIcon />
                  </IconButton>
                </Tooltip>
                )}
                {picture.isProfile && (
                <Typography variant="body1" component="div" className={classes.marginLeftAuto}>
                  <Box fontWeight="fontWeightBold">
                    Profile
                  </Box>
                </Typography>
                )}

                <Tooltip title="Remove" className={classes.marginLeftAuto}>
                  <span>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => removePicture(key)}
                      disabled={picture.isProfile}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
