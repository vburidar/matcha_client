import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import ProfilePic from '../components/ProfilePic';
import ProfileInfos from '../components/ProfileInfos';

const useStyles = makeStyles((theme) => ({
  containerMain: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
}));

function profile() {
  const classes = useStyles();
  const obj = {
    image: '/profile-pic.jpg',
    surname: 'Jean-Philippe',
    name: 'Riche de la Moutardiere',
    localisation: 'Neuilly-sur-Seine',
    description: 'Je suis un enfant de la moutarde. J\'ai toujours baigne dedans, depuis tout petit. Je suis comme elle, piquant et savoureux. Likez si vous voulez y gouter. Mais attention vous risquez de vous brulez a trop vous frotter a mon caractere epice. J\'aime le bowling, les sorties tuning avec mon pote Dede, la deglingue et manger des conserves de haricots blancs. Je n\'aime pas les froufrous, mon voisin de palier (ce fdp qui mange tout avec du ketchup), la randonnee et les pulls a cols en V',
    interest: [
      'moutarde',
      'moutarde forte',
      'moutarde moins forte',
      'moutarde plus forte',
    ],
    genre: 'Male',
    birthdate: '28/07/1986',
    preference: [
      'women',
      'men',
      'non binary',
    ],
  };

  return (
    <Grid container spacing={3} className={classes.containerMain}>
      <Grid item xs={12} sm={9} md={5} lg={4} xl={3}>
        <ProfilePic props={obj} />
      </Grid>
      <Grid item xs={12} sm={12} md={7} lg={6} xl={4} className={classes.container}>
        <ProfileInfos props={obj} />
      </Grid>
    </Grid>
  );
}

export default profile;
