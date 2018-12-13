import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormatSelectRadioButtonGroup from './FormatRadioButtonGroup'
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AddCircleIcon from '@material-ui/icons/AddCircle'


export default class FormDialog extends React.Component {
  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleSubmit = ()=>{
    var formData = new FormData(this.refs.newNoteForm);
    var note_title = formData.get('note_format');
    if(note_title===null||note_title==='') {
      alert('请输入笔记名!');
      return;
    }
    this.props.createNewNoteSubmit(formData);
    this.handleClose();
  }

  render() {
    return (
      <div>
        <ListItem button key={'新建笔记'} onClick={this.handleClickOpen}>
        <ListItemIcon><AddCircleIcon/></ListItemIcon>
        <ListItemText primary={'新建笔记'} />
        </ListItem>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">新建笔记</DialogTitle>
          <DialogContent>
            <DialogContentText>
              请输入新笔记的名称，并选择笔记类型
            </DialogContentText>
            <form ref="newNoteForm">
            <TextField
              autoFocus
              margin="dense"
              label="请输入笔记名"
              type="text"
              name="note_title"
              fullWidth
            />
          <FormatSelectRadioButtonGroup/>
          </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose.bind(this)} color="primary">
              取消
            </Button>
            <Button onClick={this.handleSubmit.bind(this)} color="primary">
              确认
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}



