import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import UserIcon from '@material-ui/icons/Face';
import ExitIcon from '@material-ui/icons/ExitToApp'
import ImageIcon from '@material-ui/icons/Image'
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

        <ListItem key={'退出登陆'} button onClick={this.props.handleClickExit.bind(this,'error')}>
          <ListItemIcon>
            <ExitIcon/>
          </ListItemIcon>
          <ListItemText primary={'退出登陆'} />
        </ListItem>
        
      </List>
    );
  }

}

export default withStyles(styles)(PersonInfoList);
