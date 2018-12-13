import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
//import RadioButonGroup from './SelectGenderRadioButtonGroup'
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
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  logo: {
    margin: 10,
    width: 70,
    height: 70,
    alignItems: 'center'
  },
});



class Register extends React.Component {

  render(){
    const { classes } = this.props;

    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
        <img src={logo} className={classes.logo} alt="logo"/>
          <Typography component="h1" variant="h5">
            注册
          </Typography>
          <form className={classes.form} id="registerForm">
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="user_name">昵称</InputLabel>
              <Input id="user_name" name="user_name" autoComplete="text" autoFocus />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email 地址</InputLabel>
              <Input id="email" name="user_mail" autoComplete="email" autoFocus />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password1">密码</InputLabel>
              <Input name="user_pass" type="password" id="password1" autoComplete="current-password" />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password2">确认密码</InputLabel>
              <Input type="password" id="password2" autoComplete="current-password" />
            </FormControl>
            {/*<RadioButonGroup/>删除性别选择选项*/}
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={this.handleRegister.bind(this)}
            >
              提交
            </Button>
          </form>
        </Paper>

        <br></br>
        <a href="signin">已经注册？登陆</a>
      </main>
    );
  }
  
  handleRegister(){
    var password1 = document.getElementById('password1').value;
    var password2 = document.getElementById('password2').value;
    var user_name = document.getElementById('user_name').value;
    var user_mail = document.getElementById('email').value;
    if(password1!==password2 || password1===null || password1==='') {
        this.displaySnackbarMsg('info')('请输入密码！');
        return;
    } else if(password1!==password2) {
        this.displaySnackbarMsg('info')('两次密码不一致！');
        return;
    } else if(user_name===null || user_name==='') {
        this.displaySnackbarMsg('info')('请输入用户名！');
        return;
    } else if(user_mail===null || user_mail==='') {
        this.displaySnackbarMsg('info')('请输入邮箱!');
        return;
    }

    var formData = new FormData(document.querySelector('form'));
    formData.append('user_avatar','');
    axios({
        method: 'post',
        url: env.apiServerAddr + '/user/register',
        data: formData,
        config: { headers: {'Content-Type': 'multipart/form-data' }}
    }).then((res)=>{ //success
        if(res.data.success) {
          var rootpath=window.location.protocol+"//"+window.location.host+"/";
          window.location.href = rootpath + 'dash';
        } else {
          this.displaySnackbarMsg('error')('注册失败')
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

Register.propTypes = {
  classes: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
};

const RegisterWithSnackBar = withSnackbar(withStyles(styles)(Register));

function RegisterWithSnackBarExport() {
  return (
    <SnackbarProvider maxSnack={3}>
      <RegisterWithSnackBar/>
    </SnackbarProvider>
  );
}

export default RegisterWithSnackBarExport;
