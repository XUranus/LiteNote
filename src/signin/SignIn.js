import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import axios from 'axios'
import env from '../EnvLoader'
import logo from '../img/logo.png'

import { SnackbarProvider, withSnackbar } from 'notistack';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  logo: {
    margin: 10,
    width: 70,
    height: 70,
    alignItems: 'center'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  }
});

class SignIn extends React.Component {

  render() {
    const { classes } = this.props;

    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
        <img src={logo} className={classes.logo} alt="logo"/>
          <Typography component="h1" variant="h5">
            登陆
          </Typography>
          <form className={classes.form}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="user_mail">Email 地址</InputLabel>
              <Input id="user_mail" name="user_mail" autoComplete="email" autoFocus />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="user_pass">密码</InputLabel>
              <Input name="user_pass" type="password" id="user_pass" autoComplete="current-password" />
            </FormControl>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="自动登陆"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={this.handleSignin.bind(this)}
            >
              登陆
            </Button>
          </form>
        </Paper>
        
        <br></br>
        <a href="register">没有帐号？注册</a>
      </main>
    );
  }


  handleSignin(){
    var user_pass = document.getElementById('user_pass').value;
    var user_mail = document.getElementById('user_mail').value;
    if(user_pass===null || user_pass==='') {
        this.displaySnackbarMsg('warning')('请输入密码！');
        return;
    }  else if(user_mail===null || user_mail==='') {
        this.displaySnackbarMsg('warning')('请输入邮箱!');
        return;
    }

    var formData = new FormData(document.querySelector('form'));
    axios({
        method: 'post',
        url: env.apiServerAddr + '/user/login',
        data: formData,
        config: { headers: {'Content-Type': 'multipart/form-data' }}
    }).then((res)=>{ //success
        if(res.data.success) {
          this.displaySnackbarMsg('success')('登陆成功，正在跳转...')
          var rootpath=window.location.protocol+"//"+window.location.host+"/";
          window.location.href = rootpath + 'dash';
        } else {
          this.displaySnackbarMsg('error')('登陆失败：'+res.data.msg)
        }
    }).catch((err)=>{ //error
        console.log(err);
        this.displaySnackbarMsg('error')('error：'+err)
    });
  }

  displaySnackbarMsg = variant => (msg) => {//显示信息
    // variant could be success, error, warning or info
    this.props.enqueueSnackbar(msg, { variant });
  };

}

SignIn.propTypes = {
  classes: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
};

const SigninWithSnackBar = withSnackbar(withStyles(styles)(SignIn));

function SigninWithSnackBarExport() {
  return (
    <SnackbarProvider maxSnack={3}>
      <SigninWithSnackBar/>
    </SnackbarProvider>
  );
}


export default SigninWithSnackBarExport;
