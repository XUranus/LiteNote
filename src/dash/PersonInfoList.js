import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import UserIcon from '@material-ui/icons/Face';
import ExitIcon from '@material-ui/icons/ExitToApp'
import ImageIcon from '@material-ui/icons/Image'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
//import axios from 'axios';
//import env from '../EnvLoader'

const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 250,
        backgroundColor: theme.palette.background.paper,
    },
    exitButton: {
      alignItems:'center',
    },
});

class PersonInfoList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;
    const user =  this.props.user;

    return (
     <List className={classes.root}>
        <ListItem button onClick={this.props.handleClickUserCenter.bind(this)}>
          <ListItemIcon>
            <UserIcon/>
          </ListItemIcon>
          <ListItemText inset primary="个人中心" />
        </ListItem>
  
        <ListItem key={'图片上传'} button onClick={this.props.handleClickImageManage.bind(this)} >
            <ListItemIcon>
            <ImageIcon/>
            </ListItemIcon>
            <ListItemText primary={'图片上传'}/>
        </ListItem>

        <ListItem key={'退出登陆'} button onClick={this.handleClickOpen}>
          <ListItemIcon>
            <ExitIcon/>
          </ListItemIcon>
          <ListItemText primary={'退出登陆'} />
        </ListItem>

        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">退出登陆</DialogTitle>
          <DialogContent>
            <DialogContentText>
              确定要退出吗？
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose.bind(this)} color="primary">
              取消
            </Button>
            <Button onClick={this.props.handleClickExit.bind(this,'error')} color="primary">
              确认
            </Button>
          </DialogActions>
        </Dialog>
        
      </List>
    );
  }

}

export default withStyles(styles)(PersonInfoList);
