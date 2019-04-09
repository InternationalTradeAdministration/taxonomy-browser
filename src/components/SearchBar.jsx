import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Select from 'react-select';
import createFilterOptions from 'react-select-fast-filter-options';
// import { createSelector } from 'reselect';
import { SimpleTokenizer, StemmingTokenizer, TfIdfSearchIndex, AllSubstringsIndexStrategy } from 'js-search';
import { stemmer } from 'porter-stemmer';
import Footer from './Footer';
import '../taxonomy-browser.css';

const searchIndex = new TfIdfSearchIndex();
const indexStrategy = new AllSubstringsIndexStrategy();
const tokenizer = new StemmingTokenizer(stemmer, new SimpleTokenizer());

class SearchBar extends Component {
  constructor() {
    super()
    this.state = {
      queryString: "",
      itemOptions: [],
      selectedTopic: "",
      footerData: {},
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeTopic = this.handleChangeTopic.bind(this);
  };

  handleChange(value) {
    // this.setState({ queryString: value.label }, () => {
    //   this.props.history.push({ pathname: `/search`, search: `&q=${this.state.queryString}&types=${this.state.selectedTopic}` });
    //   /* this submits search when the selection is selected with "Enter", as per [EDSP-646] */
    // });
    this.setState({ queryString: value.label })
  };

  handleChangeTopic(e) {
    this.setState({selectedTopic: e.target.value}, () => {
      return this.fetchOptions;
    });
  };

  fetchOptions(size="") {
    fetch(`${this.props.BASE_URL}/ita_taxonomies/search?api_key=${this.props.API_KEY}&types=${this.state.selectedTopic}&size=${size}`)
    .then(response => response.json())
    .then(response => this.setState({
      itemOptions: response.results
    }));
  }

  componentDidMount() {
    this.fetchOptions('-1');
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedTopic !== this.state.selectedTopic) { this.fetchOptions('-1') } // This doesn't work, still returns all 1618 items, not filtered by selectedTopic
  }

  // getIndexedOptions = () => createSelector(this.state.itemOptions, options =>
  //   createFilterOptions({ 
  //     options,
  //     searchIndex,
  //     indexStrategy,
  //     tokenizer,  
  //   })
  // );

  render() {

    let filterOptions = () => createFilterOptions({
      options: this.state.itemOptions,
      indexStrategy,
      searchIndex,
      tokenizer
    })
  
    return (
      <div>
        <h1>Thesaurus of International Trade Terms</h1>
        <p>The International Trade Administration’s (ITA) Thesaurus of International Trade Terms is a controlled and structured list of words and phrases used to tag and index information found on the ITA’s websites and databases. The thesaurus covers all subjects related to international trade and foreign investment with particular emphasis on exporting, trade promotion, market access and enforcement and compliance.</p>

        <form onSubmit={(event) => event.preventDefault()} className="center taxonomy-search-form">
          <label aria-label="Select a Category">
            <select value={this.state.selectedTopic} onChange={this.handleChangeTopic} className="dropdown">
              <option value="">All Categories</option>
              <option value="Industries">Industries</option>
              <option value="Countries">Countries</option>
              <option value="World Regions">World Regions</option>
              <option value="Trade Regions">Trade Regions</option>
              <option value="Trade Topics">Trade Topics</option>
            </select>
          </label>
          <Select 
            name="queryString"
            classNamePrefix="react-select"
            id="queryString"
            placeholder="Enter search query"
            aria-label="Enter search query"
            value={ {label: this.state.queryString} }
            getOptionValue={option => option.label}
            getOptionLabel={option => option.label}
            options={this.state.itemOptions}
            // filterOptions={this.getIndexedOptions}
            filterOptions={filterOptions}
            onChange={this.handleChange}
            styles={selectStyles}
          />
          <Link to={{pathname: `/search`, search: `&q=${this.state.queryString}&types=${this.state.selectedTopic}`}}>
            <button>Search</button>
          </Link>
        </form>

        <div className="categoryList">
          <p><b>Browse By: </b></p>
          <ul>
            <li><Link to={{pathname: "/#id/R79uIjoQaQ9KzvJfyB1H7Ru"}}>Industries</Link></li>
            <li><Link to={{pathname: "/#id/R8W91u35GBegWcXXFflYE4"}}>Countries</Link></li>
            <li><Link to={{pathname: "/#id/R8cndKa2D8NuNg7djwJcXxB"}}>World Regions</Link></li>
            <li><Link to={{pathname: "/#id/R7ySyiNxcfeZ6bfNjhocNun"}}>Trade Regions</Link></li>
            <li><Link to={{pathname: "/#id/RBBed4Voz7iS3nUECA3yzNM"}}>Trade Topics</Link></li>
          </ul>
        </div>

        <Footer json={this.state.footerData}/>
      </div>
    )
  }
}

export default withRouter(SearchBar);

const selectStyles = {
  container: (provided) => ({
    ...provided,
    display: 'inline-block',
    width: '250px',
    minHeight: '1px',
    textAlign: 'left',
    border: 'none',
  }),
  control: (provided) => ({
    ...provided,
    border: '2px solid #757575',
    borderRadius: '0',
    minHeight: '1px',
    height: '42px',
    marginLeft: '5px',
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    display: 'none',
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    display: 'none',
  }),
  valueContainer: (provided) => ({
    ...provided,
    minHeight: '1px',
    height: '42px',
    paddingTop: '0',
    paddingBottom: '0',
  }),
  singleValue: (provided) => ({
    ...provided,
    minHeight: '1px',
    paddingBottom: '7px',
  }),
  input: (provided) => ({
    ...provided,
    minHeight: '1px',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#515151',
  })
}