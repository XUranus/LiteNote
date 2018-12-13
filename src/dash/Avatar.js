import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import deepPurple from '@material-ui/core/colors/deepPurple';

const styles = {
  avatar: {
    margin: 10,
  },
  bigAvatar: { //大头像
    margin: 10,
    width: 60,
    height: 60,
  },
  purpleAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: deepPurple[500],
  },
};

function ImageAvatars(props) {
  const { classes } = props;
  return (
    <Grid container justify="center" alignItems="center">
      {props.user.user_avatar!=='' ? 
      <Avatar src={props.user.user_avatar} className={classes.avatar} />:
      <Avatar className={classes.purpleAvatar}>Hi</Avatar>
      }
      {props.display===true?props.user.user_name:''}
    </Grid>
  );
}

ImageAvatars.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ImageAvatars);