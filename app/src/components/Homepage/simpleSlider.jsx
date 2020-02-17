import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Button from '@material-ui/core/Button';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  CarouselProvider, Slider, Slide, ButtonBack, ButtonNext,
} from 'pure-react-carousel';

const useStyles = makeStyles((theme) => ({
  prev: {
    height: '4em',
    position: 'absolute',
    top: '50%',
    borderRadius: '4px',
    transform: 'translateY(-50%)',
    left: '0',
    backgroundColor: theme.palette.primary.main,
    color: 'white',
  },
  next: {
    height: '4em',
    textAlign: 'right',
    position: 'absolute',
    top: '50%',
    borderRadius: '4px',
    transform: 'translateY(-50%)',
    right: '0',
    backgroundColor: theme.palette.primary.main,
    color: 'white',
  },
  carousel: {
    position: 'relative',
  },
  slider: {
  },
  image: {
    width: '100%',
    position: 'absolute',
    left: '0',
    top: '10%',
  },
}));

export default function simpleSlider({ imageList }) {
  const classes = useStyles();

  const handleClick = () => {
    ButtonBack.click();
  };

  return (
    <CarouselProvider
      className={classes.carousel}
      naturalSlideWidth={100}
      naturalSlideHeight={125}
      totalSlides={imageList.split(',').length}
      infinite
    >
      <Slider>
        {imageList.split(',').map((element, index) => <Slide key={element} index={index}><img className={classes.image} src={element} alt='Not found' /></Slide>)}
      </Slider>
      <ButtonBack className={classes.prev}><ArrowBackIosIcon /></ButtonBack>
      <ButtonNext className={classes.next}><ArrowForwardIosIcon /></ButtonNext>
    </CarouselProvider>
  );
}
