import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import arrow from '../images/Right_Arrow.png';
import FloatingSearchBox from './FloatingSearchBox';
import Loader from 'react-loader-spinner';
import topics from '../topics';

class TermInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      item: {
        type: [],
        annotations: {},
        object_properties: {
          member_of: [{}], has_member: [{}], main_concept_of: [{}], has_main_concept: [{}],
          has_related: [{}], has_broader: [{}], has_narrower: [{}],
          is_in_scheme: [{}], is_top_concept_in_scheme: [{}], micro_thesaurus_of: [{}],
          sub_group: [{}], super_group: [{}], iso_thes_super_group: [{}]
        },
      },
      errorMessage: "",
      loading: false,
    }
  };

  targetUrl = () => {
    const id =  this.props.match.params.id;
    // console.log(`fetching from: ${this.props.BASE_URL}/ita_taxonomies/${id}?api_key=${this.props.API_KEY}`);
    return `${this.props.BASE_URL}/ita_taxonomies/v1/show/${id}?subscription-key=${this.props.API_KEY}`;
  };

  normalizeResult = (result) => {
    const annotationPropertyEntries = result.annotation_properties.map(property => {
      return [property.property_type, property.values]
    })

    const annotations = Object.fromEntries(annotationPropertyEntries)

    const objectPropertyEntries = result.object_properties.map(property => {
      return [property.property_type, property.values]
    })

    const object_properties = Object.fromEntries(objectPropertyEntries)

    result.type = 'N/A'
    result.annotations = annotations
    result.object_properties = object_properties
    return result
  }

  fetchData = () => {
    fetch(this.targetUrl())
      .then(response => response.json())
      .then(response => this.setState({item: this.normalizeResult(response), loading: false}))
      .catch(error => console.log(error), (error) => {
        this.setState({errorMessage: error, loading: false});
      })
  };

  componentDidMount = () => {
    this.setState({loading: true}, () => {
      this.fetchData();
    })
  };

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.fetchData(this.props.match.params.id);
    }
  };

  render() {
    const {
      type,
      annotations,
      object_properties,
    } = this.state.item;

    const sortedTerms = (attribute) => {
      if (attribute) {
        return attribute.sort(function(a, b) {
          if (a.label.toLowerCase() < b.label.toLowerCase()) { return -1 }
          if (a.label.toLowerCase() > b.label.toLowerCase()) { return 1 }
          return 0;
        }).map((t, i) => {
          return <li key={i}><Link to={{pathname: `/id/${t.id}`}}>{t.label}</Link></li>
        })
      } else return null
    };

    const termLabel = (item) => {
      if (item.annotations.pref_label) {
        return item.annotations.pref_label
      } else {
        return item.label
      }
    }

    const topConcepts = () => {
      if (object_properties.has_main_concept) {
        return sortedTerms(object_properties.has_main_concept)
      } else if (object_properties.has_member) {
        return sortedTerms(object_properties.has_member)
      }
    }

    const topConceptOf = () => {
      if (object_properties.is_main_concept_in_collection) {
        return sortedTerms(object_properties.is_main_concept_in_collection)
      } else if (object_properties.member_of) {
        return sortedTerms(object_properties.member_of)
      }
    }

    return (
      <div>
        <FloatingSearchBox BASE_URL={this.props.BASE_URL} API_KEY={this.props.API_KEY}/>

        { this.state.loading ? (<div className="spinner"><Loader type="ThreeDots" color="#00CC66" width="100"/></div>) : (
          <>
            <div className="breadcrumbs">
              <h3><Link to={{pathname: `/`}}>ITA Thesaurus</Link> > </h3>

              {/*{!!(type[0]) ? (<h3><Link to={{pathname: `/id/${topics[type[0]].id}`}}>{type[0]}</Link> > </h3>) : null}*/}

              <h3>{termLabel(this.state.item)}</h3>
            </div>

            <h1>{termLabel(this.state.item)}</h1>

            <div className="termInfo">
              { annotations.definition ? (
                <>
                  <h4>Description</h4>
                  {annotations.definition.map((t, i) => <p key={i}>{t}</p>)}
                </>
              ) : null }

              { annotations.scope_note ? (
                <>
                  <h4>Scope Note</h4>
                  {annotations.scope_note.map((t, i) => <p key={i}>{t}</p>)}
                </>
              ) : null }

              { annotations.alt_label ? (
                <>
                  <h4>Used for</h4>
                  <ul>{annotations.alt_label.map((t, i) => <li key={i}>{t}</li>)}</ul>
                </>
              ) : null}

              { object_properties.sub_group ? (
                <>
                  <h4>Concept Groups</h4>
                  <ul>{sortedTerms(object_properties.sub_group)}</ul>
                </>
              ) : null }

              { object_properties.iso_thes_super_group ? (
                <>
                  <h4>Member of Concept Group</h4>
                  <ul>{sortedTerms(object_properties.iso_thes_super_group)}</ul>
                </>
              ) : null }

              { (object_properties.has_main_concept || object_properties.has_member) ? (
                <>
                  <h4>Top Concepts</h4>
                  <ul>{topConcepts()}</ul>
                </>
              ) : null }

              { (object_properties.is_main_concept_in_collection || object_properties.member_of) ? (
                <>
                  <h4>Top Concept of</h4>
                  <ul>{topConceptOf()}</ul>
                </>
              ) : null }
            </div>

            <div className="termRelation">

              { object_properties.has_broader ? (
                <div className="broader">
                  <b><p>Broader terms: </p></b>
                  <ul>
                    {sortedTerms(object_properties.has_broader)}
                  </ul>
                </div>) : null }

              { ((object_properties.has_broader && object_properties.has_related) || (object_properties.has_broader && object_properties.has_narrower)) ? (
                <img src={arrow} alt="arrow pointing right"/>
              ) : null }

              { object_properties.has_related ? (
                <div className="related">
                  <b><p>Related terms: </p></b>
                  <ul>
                    {sortedTerms(object_properties.has_related)}
                  </ul>
                </div>
              ) : null }

              { (object_properties.has_related && object_properties.has_narrower) ? (
                <img src={arrow} alt="arrow pointing right"/>
              ) : null }

              { object_properties.has_narrower ? (
                <div className="narrower">
                  <b><p>Narrower Terms: </p></b>
                  <ul>
                    {sortedTerms(object_properties.has_narrower)}
                  </ul>
                </div>
              ) : null }

            </div>
          </>
        )}
      </div>
    );
  }
};

export default withRouter(TermInfo);
