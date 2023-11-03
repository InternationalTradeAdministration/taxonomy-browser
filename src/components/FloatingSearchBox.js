import React, { Component } from "react";
import { Link, withRouter } from 'react-router-dom';
import Autocomplete from 'react-autocomplete';


class FloatingSearchBox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      queryString: "",
      autosuggestions: [],
    }
    this.handleChange = this.handleChange.bind(this);
    this.onSelectSuggestion = this.onSelectSuggestion.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.getItemValue = this.getItemValue.bind(this);
    this.retrieveSuggestions = this.retrieveSuggestions.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value }, this.initiateSuggestions);
  };

  initiateSuggestions = () => {
    if (this.state.queryString.length > 1) {
      this.retrieveSuggestions(this.state.queryString);
    } else {
      this.setState({ autosuggestions: [] })
    }
  }

  onSelectSuggestion(val, event){
    this.props.history.push({ pathname: `/id/${event.id}`, state: {pageId: event.id} });
  };

  retrieveSuggestions(value) {
    this.setState({autosuggestions: []});
    let searchUrl = (
      `${this.props.BASE_URL}/ita_taxonomies/v1/suggest?subscription-key=${this.props.API_KEY}&q=${encodeURIComponent(value)}&types=`
    );
    fetch(searchUrl)
    .then(response => response.json())
    .then(response => this.setState({autosuggestions: response.results}))
  }

  getItemValue(item) {
    return `${item.label}`
  }

  renderItem(item, isHighlighted){
    return (
      <div key={item.id} style={{ background: isHighlighted ? 'lightblue' : 'white', textAlign: 'left', 'padding': '5px' }}>
        <Link to={{pathname: `/id/${item.id}`, state: {pageId: item.id}}} style={{ 'textDecoration': 'none', 'color': '#292a2b', 'fontSize': '11.5pt' }}>
          {item.label}
        </Link>
      </div>
    );
  };

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.queryString.trim().length > 0) {
      this.props.history.push({pathname: `/search`, search: `&q=${encodeURIComponent(this.state.queryString)}&types=`});
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="newSearch">
        <Autocomplete
          inputProps = {{
            type: 'text',
            name: "queryString",
            id: "queryString",
            placeholder: "Enter search query",
            'aria-label': "Enter search query",
          }}
          autoHighlight={false}
          value={this.state.queryString}
          items={this.state.autosuggestions}
          getItemValue={this.getItemValue}
          renderItem={this.renderItem}
          onChange={this.handleChange}
          onSelect={this.onSelectSuggestion}
        />
        <button type="submit" aria-label="submit">Search</button>
      </form>
    )
  }
}

export default withRouter(FloatingSearchBox);
