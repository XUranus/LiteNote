import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import NoteIcon from '@material-ui/icons/Note'
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Avatar from '@material-ui/core/Avatar';
import deepPurple from '@material-ui/core/colors/deepPurple';

const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 250,
        backgroundColor: theme.palette.background.paper,
    },
    purpleAvatar: { //Markdown richText图标
      margin: 1,
      color: '#fff',
      backgroundColor: deepPurple[500],
      width: 25,
      height: 25
    },
});

class NoteList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            noteListOpen:true,
        };
    }

  handleClick = ()=>{
    this.setState({
      noteListOpen: !this.state.noteListOpen,
    });
  }

  handleClickNote = (note_id)=>{
    this.props.editNote(note_id);
  }


  render() {
    const { classes } = this.props;
    const notes =  this.props.NoteList;

    return (
     <List className={classes.root}>
        <ListItem button onClick={this.handleClick}>
          <ListItemIcon>
            <NoteIcon />
          </ListItemIcon>
          <ListItemText inset primary="我的笔记" />
          {this.state.noteListOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={this.state.noteListOpen} timeout="auto" unmountOnExit>
          <List className={classes.root} component="div" disablePadding>
            {notes.map((note,index)=>(
                <ListItem key={note.note_id} button onClick={this.handleClickNote.bind(this,note.note_id)} >
                <ListItemIcon><Avatar className={classes.purpleAvatar}>{note.note_format==='markdown'?'M':'T'}</Avatar></ListItemIcon>
                <ListItemText primary={note.note_title} secondary={note.content}/>
                </ListItem>
            ))}
          </List>
        </Collapse>
      </List>
    );
  }
}

export default withStyles(styles)(NoteList);
