import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { Button } from '@material-ui/core';
import axios from 'axios';
import env from '../EnvLoader'

const styles = theme => ({
  card: {
    display: 'flex',
  },  
  bigAvatar: {
    margin: 20,
    width: 200,
    height: 200,
  },
  preview: {
    margin:15,
  }, 
  edit: {
    margin:15,
    maxWidth:300
  }
});

class UserCenter extends React.Component {

  constructor(props) {
    super(props);
    const user = props.user;
    this.state = {
        edit:false,
        edit_user_name:user.user_name,
        edit_user_mail:user.user_mail,
        edit_user_avatar:user.user_avatar,
    }
  }

  handleClickEdit() {
    this.setState({edit:true})
  }

  handleClickConfirm() {
    const user = this.state;
    axios({
      method: 'post',
      url: env.apiServerAddr + '/user/modifyInfo',
      data: {
        user_mail:user.edit_user_mail,
        user_name:user.edit_user_name,
        user_avatar:user.edit_user_avatar,
      }
    }).then((res)=>{ //success
        console.log(res)
        if(res.data.success) {
          this.props.snackbarMsgHandler('success')('修改成功')
          this.setState({
            edit:false
          });
          this.props.syncUserInfo();
        } else {
          this.props.snackbarMsgHandler('error')('修改失败: '+res.data.msg)
          this.setState({
            edit:false,
            edit_user_name:this.props.user.user_name,
            edit_user_mail:this.props.user.user_mail,
            edit_user_avatar:this.props.user.user_avatar,
          });
        }
    }).catch((err)=>{ //error
        console.log(err);        
        this.props.snackbarMsgHandler('error')('error: '+err)
        this.setState({
          edit:false,
          edit_user_name:this.props.user.user_name,
          edit_user_mail:this.props.user.user_mail,
          edit_user_avatar:this.props.user.user_avatar,
        });
    });
  }

  onUserNameInputChange(e) {
    this.setState({ edit_user_name: e.target.value } );
  }

  onUserAvatarInputChange(e) {
    this.setState({ edit_user_avatar: e.target.value } );
  }

  onUserMailInputChange(e) {
    this.setState({ edit_user_mail: e.target.value } );
  }
 
  render() {
    const { classes, theme } = this.props;
    const user = this.props.user;

    return (
        <Card className={classes.preview}>
            <Grid container spacing={24}>
                <Grid item >
                  <Avatar alt="Remy Sharp" src={user.user_avatar} className={classes.bigAvatar} /> 
                </Grid>

                <Grid item >

                <form className={classes.edit} ref='infoEdit'>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="user_mail">邮 箱</InputLabel>
                  <Input 
                    id="user_mail" 
                    name="user_mail" 
                    autoComplete="mail" 
                    autoFocus 
                    value={this.state.edit_user_mail||''} 
                    disabled={!this.state.edit} 
                    onChange={this.onUserMailInputChange.bind(this)}
                  />
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="user_name">用户名</InputLabel>
                  <Input 
                    id="user_name" 
                    name="user_name" 
                    autoComplete="text" 
                    autoFocus 
                    value={this.state.edit_user_name||''} 
                    disabled={!this.state.edit} 
                    onChange={this.onUserNameInputChange.bind(this)}
                  />
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="user_avatar">头像链接</InputLabel>
                  <Input 
                    id="user_avatar" 
                    name="user_avatar" 
                    autoComplete="text" 
                    autoFocus 
                    value={this.state.edit_user_avatar||''} 
                    disabled={!this.state.edit}
                    onChange={this.onUserAvatarInputChange.bind(this)}
                  />
                </FormControl>
                {this.state.edit?
                (<Button onClick={this.handleClickConfirm.bind(this)}>保存</Button>):
                (<Button onClick={this.handleClickEdit.bind(this)}>编辑</Button>)
                }
                </form>

                </Grid>
            </Grid>
        </Card>
      );
  }
  
  hh(){
    alert('222');
  }
}

UserCenter.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(UserCenter);