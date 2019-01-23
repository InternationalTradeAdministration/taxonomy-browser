import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import ResultsList from './ResultsList';
import TermInfo from './TermInfo';
import Thesauri from './Thesauri';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route exact path={`${process.env.PUBLIC_URL}/`} component={Thesauri} />

        <Route exact path={`${process.env.PUBLIC_URL}/resultsList`} render={(props) => <ResultsList {...props} API_KEY={this.props.API_KEY} />} />

        <Route exact path={`${process.env.PUBLIC_URL}/id/:id`} render={(props) => <TermInfo {...props} API_KEY={this.props.API_KEY} location={props.location} />} />
      </div>
    );
  }
}

export default withRouter(App);