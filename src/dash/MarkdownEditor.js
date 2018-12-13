import 'braft-editor/dist/index.css'
import React from 'react'
import Grid from '@material-ui/core/Grid';
import ReactMarkdown from 'react-markdown/with-html';
import { withStyles } from '@material-ui/core/styles';
import {UnControlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/theme/neat.css';
import 'codemirror/mode/xml/xml.js';
import 'codemirror/mode/javascript/javascript.js';


const styles = theme => ({
    codeMirror: {
      fontSize: 20,
      display: 'flex',
      flexDirection: 'column',
      height: 'auto'
    },
});


class MarkdownEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            current_content: this.props.note.content
        }
    }

    render() {
        const {classes,theme} = this.props;
        return (
            <Grid container spacing={24}>
                <Grid item xs>
                <CodeMirror
                    className = {classes.codeMirror}
                    value={this.props.note.content}
                    options={{
                        theme: 'material',
                        lineNumbers: true,
                        mode: "text/javascript",
                        lineWrapping: true,
                        matchClosing: true,
                        
                      }}
                    onChange={(editor, data,value) => {
                        this.setState({current_content:value});
                    }}
                    />
                </Grid>
                <Grid item xs>
                    <ReactMarkdown source={this.state.current_content} />
                </Grid>
            </Grid>
        );
    }


}



export default withStyles(styles)(MarkdownEditor)