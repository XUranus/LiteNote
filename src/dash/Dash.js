import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import RichEditor from './RichEditor';
import NoteList from './NoteList';
import axios from 'axios'
import env from '../EnvLoader'
import WelcomePage from './Welcome'
import CreateNewNoteDialog from './CreateNewNoteDialog'
import Avatar from './Avatar'
import MarkdownEditor from './MarkdownEditor'
import { SnackbarProvider, withSnackbar } from 'notistack';
import PersonInfoList from './PersonInfoList'
import UserCenter from './UserCenter';
import ImageManage from './ImageManage'

const drawerWidth = 250;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing.unit * 7 + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9 + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 1,
  },
});

class Dash extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      rightPanel:'welcome', //
      toolbar: 'LiteNote',
      drawerOpen: true,
      noteList: [],
      user: {}
    };
    this.syncUserInfo();
    this.syncNoteList();
  }

  handleDrawerOpen = () => {
    this.setState({ drawerOpen: true });
  };

  handleDrawerClose = () => {
    this.setState({ drawerOpen: false});
  };

  syncUserInfo = ()=>{ //获取用户信息
    axios({
      method: 'post',
      url: env.apiServerAddr + '/user/getInfo'
    }).then((res)=>{ //post success
      var data = res.data;
      if(!data.success) { //登陆失效
        var rootpath=window.location.protocol+"//"+window.location.host+"/";
        window.location.href = rootpath + 'signin';
      } else {
        this.setState({user: data.data});
      }
    }).catch((err)=>{ //error
      console.log(err);
      this.displaySnackbarMsg('error')('同步用户信息失败: '+err);
    });
  }

  syncNoteList = ()=>{ //同步笔记列表
    axios({
      method: 'post',
      url: env.apiServerAddr + '/note/getNotesList',
      data: {}
    }).then((res)=>{ //post success
      var data = res.data;
      this.setState({noteList: data.data});
      console.log(this.state)
    }).catch((err)=>{ //error
      console.log(err);
      this.displaySnackbarMsg('error')('同步笔记列表失败: '+err);
    });
  }

  handleCreateNewNoteSubmit = (formData)=>{//处理创建新笔记的请求
    console.log(formData.get('note_title'));
    axios({
      method: 'post',
      url: env.apiServerAddr + '/note/newNote',
      data: formData,
      config: { headers: {'Content-Type': 'multipart/form-data' }}
    }).then((res)=>{ //post success
      if(res.data.success) {
        this.syncNoteList();
      } else {
        this.displaySnackbarMsg('error')('创建新笔记失败:'+res.data.msg)
      }
    }).catch((err)=>{ //error
      console.log(err);
      this.displaySnackbarMsg('error')('创建新笔记失败:'+err);
    });
  }

  handleEditNode = (note_id)=>{ //打开笔记编辑窗口
    axios({
      method: 'post',
      url: env.apiServerAddr + '/note/getNote',
      data: {note_id:note_id},
      config: { headers: {'Content-Type': 'application/json' }}
    }).then((res)=>{ //post success
      if(res.data.success) {
        var note = res.data.data[0];
        this.setState({
          rightPanel:note.note_format,
          noteEditing: note,
          toolbar: note.note_title
        })
        console.log(this.state.noteEditing.note_title)
      } else {
        this.displaySnackbarMsg('error')('打开笔记失败:'+res.data.msg)
      }
    }).catch((err)=>{ //error
      console.log(err);
      this.displaySnackbarMsg('error')('打开笔记失败:'+err);
    });
  }

  handleExit = ()=>{
    axios({
      method: 'post',
      url: env.apiServerAddr + '/user/logout',
    }).then((res)=>{ //success
        if(res.data.success) {
          var rootpath=window.location.protocol+"//"+window.location.host+"/";
          window.location.href = rootpath + 'signin'; //回到登陆
        } else {
          this.displaySnackbarMsg('error')('注销失败')
        }
    }).catch((err)=>{ //error
        console.log(err);        
        this.displaySnackbarMsg('注销失败：')('error：'+err)
    });
  }

  handleClickUserCenter = ()=>{
    this.setState({
      rightPanel:'userCenter',
      toolbar:'个人中心'
    });
  }

  handleClickImageManage = ()=>{
    this.setState({
      rightPanel:'imageManage',
      toolbar:'图片上传'
    });
  }



  render() {
    const { classes, theme } = this.props;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={classNames(classes.appBar, {
            [classes.appBarShift]: this.state.drawerOpen,
          })}
        >
          <Toolbar disableGutters={!this.state.drawerOpen}>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(classes.menuButton, {
                [classes.hide]: this.state.drawerOpen,
              })}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" noWrap>
              {this.state.toolbar}
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Drawer
          variant="permanent"
          className={classNames(classes.drawer, {
            [classes.drawerOpen]: this.state.drawerOpen,
            [classes.drawerClose]: !this.state.drawerOpen,
          })}
          classes={{
            paper: classNames({
              [classes.drawerOpen]: this.state.drawerOpen,
              [classes.drawerClose]: !this.state.drawerOpen,
            }),
          }}
          open={this.state.drawerOpen}
        >
          <div className={classes.toolbar}>
            <Avatar user={this.state.user} display={this.state.drawerOpen}/>
            <IconButton onClick={this.handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </div>
          <Divider />

          <List>
            <CreateNewNoteDialog createNewNoteSubmit={this.handleCreateNewNoteSubmit.bind(this)} />
          </List>
          <Divider/>

          <NoteList 
            NoteList={this.state.noteList}
            editNote={this.handleEditNode.bind(this)}
          />
          <Divider/>

          <PersonInfoList 
            user={this.state.user} 
            handleClickExit={this.handleExit.bind(this)}
            handleClickUserCenter={this.handleClickUserCenter.bind(this)}
            handleClickImageManage={this.handleClickImageManage.bind(this)} 
          />
          
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar}  />
            {this.state.rightPanel==='userCenter'?<UserCenter user={this.state.user} snackbarMsgHandler={this.displaySnackbarMsg.bind(this)}/>:null}
            {this.state.rightPanel==='markdown'?<MarkdownEditor note={this.state.noteEditing} snackbarMsgHandler={this.displaySnackbarMsg.bind(this)}/>:null}
            {this.state.rightPanel==='richText'?<RichEditor note={this.state.noteEditing} snackbarMsgHandler={this.displaySnackbarMsg.bind(this)}/>:null}
            {this.state.rightPanel==='welcome'?<WelcomePage/>:null}
            {this.state.rightPanel==='imageManage'?<ImageManage snackbarMsgHandler={this.displaySnackbarMsg.bind(this)} user={this.state.user}/>:null}
        </main>
      </div>
    );
  }

  displaySnackbarMsg = variant => (msg) => {//显示信息
    // variant could be success, error, warning or info
    this.props.enqueueSnackbar(msg, { variant });
  };
}

Dash.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
};

const DashWithSnackBar = withSnackbar( withStyles(styles, { withTheme: true })(Dash));

function DashWithSnackBarExport() {
  return (
    <SnackbarProvider maxSnack={3}>
      <DashWithSnackBar/>
    </SnackbarProvider>
  );
}

export default DashWithSnackBarExport;
