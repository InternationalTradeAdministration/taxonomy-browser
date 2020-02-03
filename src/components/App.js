import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import SearchBar from './SearchBar';
import ResultsList from './ResultsList';
import TermInfo from './TermInfo';
import config from '../config.js';

class App extends Component {
  render() {
    return (
      <div className="taxonomy_container">
        <Route exact path={`/`} render={(props) => <SearchBar {...props} BASE_URL={config.BASE_URL} ACCESS_TOKEN={config.ACCESS_TOKEN} />} />
        <Route path={`/search`} render={(props) => <ResultsList {...props} BASE_URL={config.BASE_URL} ACCESS_TOKEN={config.ACCESS_TOKEN} />} />
        <Route exact path={`/id/:id`} render={(props) => <TermInfo {...props} BASE_URL={config.BASE_URL} ACCESS_TOKEN={config.ACCESS_TOKEN} location={props.location} />} />
      </div>
    );
  }
}

export default withRouter(App);