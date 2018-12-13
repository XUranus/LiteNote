import React, { Component } from 'react';
import { BrowserRouter, Route} from 'react-router-dom';

import SignIn from './signin/SignIn';
import Register from './register/Register'
import Dash from './dash/Dash';
import Share from './share/Share';
import Demo from './Demo';
import Snackbar from './WarnSnackbar'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
      <div>
        <Route path="/signin" component={SignIn}/>
        <Route path="/register" component={Register}/>
        <Route path="/dash" component={Dash}/>
        <Route path="/share" component={Share}/>
        <Route path="/demo" component={Demo}/>
        <Route path="/snackbar" component={Snackbar}/>
        <Route exact path="/" component={Dash}/>
      </div>
    </BrowserRouter>
    );
  }
}

export default App;
