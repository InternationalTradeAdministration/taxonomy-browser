import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import Loader from 'react-loader-spinner';
import FloatingSearchBox from './FloatingSearchBox';
import Footer from './Footer';
class ResultsList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      numberOfResults: 0,
      activePage: 1,
      itemsPerPage: 20,
      results: [],
      footerData: {},
      errorMessage: '',
      loading: false,
    }
  };

  searchUrl = () =>  {
    const size = this.state.itemsPerPage;
    const searchParams = this.props.location.search;
    return `${this.props.BASE_URL}/ita_taxonomies/search?api_key=${this.props.API_KEY}&size=${size}${searchParams}&offset=${(this.state.activePage-1)*(size)}`

  };

  fetchResults = () => {
    // console.log("ResultsList fetched from: " + this.searchUrl());
    this.setState({loading: true}, () => {
      fetch(this.searchUrl())
      .then(response => response.json())
      .then(response => this.setState({ results: response.results, footerData: response, numberOfResults: response.total, offset: response.offset, loading: false }))
      .catch(error => console.log(error), (error) => {
        this.setState({errorMessage: error, loading: false});
      })
    })
  };

  handlePageChange(pageNumber) {
    this.setState({ activePage: pageNumber }, () => this.fetchResults());
  };

  componentDidMount = () => {
    this.fetchResults();
  };

  componentDidUpdate(prevProps) {
    if (this.props.location.search !== prevProps.location.search) {
      this.fetchResults();
    }
  };

  itemType(item) {
    if (item.type.length > 0) {return (`${item.type[0]} > `)}
  }

  subTopic(item) {  // "member_of" or "sub_class_of"
    if (item.object_properties.member_of) return (
        `${item.object_properties.member_of[0].label} > `
      )
    else if (item.sub_class_of[0]) return (`${item.sub_class_of[0].label} > `)
    else return null
  };

  sortedItems(items) {
    if (items) {
      return items.sort(function(a, b) {
        if (a.label < b.label) { return -1 }
        if (a.label > b.label) { return 1 }
        return 0;
      })
    } else return null
  };

  render() {
  
    return (
      <div className="resultsList">
        <FloatingSearchBox BASE_URL={this.props.BASE_URL} API_KEY={this.props.API_KEY}/>

        <h1>Search Results</h1>
        <p><b>{this.state.numberOfResults} results:</b></p>

        {(this.state.loading) ? (
          <div className="spinner"><Loader type="ThreeDots" color="#00CC66" width="100"/></div>
        ) : (
          <ul>
            {this.sortedItems(this.state.results).map(item => {
              return (
                <li key={item.id}>
                  <Link to={{pathname: `/id/${item.id}`, state: {pageId: item.id}}}>
                    {`${this.itemType(item)}${this.subTopic(item)}${item.label}`}
                  </Link>
                </li>)
            })}
          </ul>
        )}
        { (this.state.numberOfResults > 0) ? (
          <Pagination 
            activePage={this.state.activePage}
            totalItemsCount={this.state.numberOfResults}
            itemsCountPerPage={this.state.itemsPerPage}
            firstPageText="First"
            prevPageText="<"
            nextPageText=">"
            lastPageText="Last"
            onChange={(pageNumber) => this.handlePageChange(pageNumber)}
          />
        ) : null }
        <br />
        <Footer json={this.state.footerData}/>
      </div>
    );
  }
}

export default withRouter(ResultsList);