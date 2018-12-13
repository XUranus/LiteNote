import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import red from '@material-ui/core/colors/red';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { Button } from '@material-ui/core';
import env from '../EnvLoader'
//import CopyIcon from '@material-ui/icons/FileCopy';
//import IconButton from '@material-ui/core/IconButton';
//import DeleteIcon from '@material-ui/icons/DeleteForever';

const styles = theme => ({
  card: {
    maxWidth: 500,
    padding: theme.spacing.unit * 2,
    margin: '5px',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex',
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    marginLeft: 'auto',
    [theme.breakpoints.up('sm')]: {
      marginRight: -8,
    },
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
});

class ImagePreviewCard extends React.Component {

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  render() {
    const { classes } = this.props;
    const image = this.props.image;

    return (
      <Card className={classes.card}>
        <CardHeader
          subheader={image.upload_at.substr(0,10)+'  '+parseInt(image.image_size)+'KB'}
        />
        <CardMedia
          className={classes.media}
          image={env.imageServerAddr +'/'+ image.image_filename}
        />
        <CardActions className={classes.actions} disableActionSpacing>
          <Button aria-label="删除" onClick={this.deleteImage.bind(this)}>
            删除
          </Button>
        
          <CopyToClipboard text={env.imageServerAddr + '/'+image.image_filename}>
          <Button aria-label="复制连接">
            复制链接
          </Button>
          </CopyToClipboard>
        </CardActions>
        
      </Card>
    );
  }

  deleteImage = ()=>{
      this.props.deleteImage(this.props.image.image_id);
  }
}

ImagePreviewCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ImagePreviewCard)