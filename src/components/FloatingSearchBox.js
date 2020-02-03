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
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value }, this.initiateSuggestions);
  };

  initiateSuggestions = () => {
    if (this.state.queryString.length > 3) {
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
      `${this.props.BASE_URL}/ita_taxonomies/search?&q=${value}&types=`
    );
    fetch(searchUrl, {
      headers: { 'Authorization': 'Bearer ' + this.props.ACCESS_TOKEN }
    })
    .then(response => response.json())
    .then(response => this.setState({autosuggestions: response.results}))
  }

  getItemValue(item) {
    return `${item.label}`
  }

  renderItem(item, isHighlighted){
    return (
      <div key={item.id} style={{ background: isHighlighted ? 'lightblue' : 'white', textAlign: 'left', 'paddingTop': '5px', 'paddingBottom': '5px' }}>
        <Link to={{pathname: `/id/${item.id}`, state: {pageId: item.id}}} style={{ 'textDecoration': 'none', 'color': '#292a2b', 'fontSize': '11.5pt' }}>
          {item.label}
        </Link>
      </div>
    ); 
  };

  render() {
    return (
      <form onSubmit={(event) => event.preventDefault()} className="newSearch">
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
        <Link to={{pathname: `/search`, search: `&q=${this.state.queryString}&types=`}} >
          <button>Search</button>
        </Link>
      </form>
    )
  }
}

export default withRouter(FloatingSearchBox);