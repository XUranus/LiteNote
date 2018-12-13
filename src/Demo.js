import React from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import IconButton from '@material-ui/core/IconButton';

class App extends React.Component {
  state = {
    value: '',
    copied: false,
  };
 
  render() {
    return (
      <div>
        <input value={this.state.value}
          onChange={({target: {value}}) => this.setState({value, copied: false})} />
 
 <CopyToClipboard text="Hello!">
  <button>Copy to clipboard</button>
</CopyToClipboard>
 
        {this.state.copied ? <span style={{color: 'red'}}>Copied.</span> : null}
      </div>
    );
  }
}

export default App;