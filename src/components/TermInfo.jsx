import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom'; 
import arrow from '../Right_Arrow.png';
import Footer from './Footer';
import Topics from './topics';
class TermInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      item: {
        type: [],
        sub_class_of: [{}],
        annotations: {},
        related_terms: {}, // seems to always be empty
        object_properties: { member_of: [{}], has_related: [{}], has_broader: [{}], has_narrower: [{}], has_member: [{}], is_in_scheme: [{}], is_top_concept_in_scheme: [{}], micro_thesaurus_of: [{}] },
      },
      errorMessage: '',
      loading: false,
    }
  }

  targetUrl = () => {
    const id =  this.props.match.params.id;
    return `https://api.trade.gov/ita_taxonomies/${id}?api_key=${this.props.API_KEY}`;
  };

  fetchData = () => {
    fetch(this.targetUrl())
      .then(response => response.json())
      .then(response => this.setState({item: response, loading: false}))
      .catch(error => console.log(error), (error) => {
        this.setState({errorMessage: error, loading: false});
      })
  }

  componentDidMount = () => {
    this.setState({loading: true}, () => {
      this.fetchData();
    })
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.fetchData(this.props.match.params.id);
    }
  }

  render() {
    const {
      label,
      type,
      annotations,
      sub_class_of,
      object_properties,
      // related_terms,
    } = this.state.item;

    console.log("TermInfo fetched from: " + this.targetUrl())
    console.log(this.state.item)

    const subTopic = () => {
      if (object_properties.member_of) return (<h3><Link to={{pathname: `/id/${object_properties.member_of[0].id}`}}>{object_properties.member_of[0].label}</Link> > </h3>)
      else if (sub_class_of[0]) return (<h3><Link to={{pathname: `/id/${sub_class_of[0].id}`}}>{sub_class_of[0].label}</Link> > </h3>)
      else return null
    }

    const description = () => {
      if (annotations.definition) {
        return (<p><b>Description: </b>{annotations.definition}</p>)
      } else if (annotations.scope_note) {
        return (<p><b>Description: </b>{annotations.scope_note}</p>)
      } else return null
    }

    const narrowerTerms = () => {
      if (object_properties.has_narrower) {
        return (object_properties.has_narrower.map((t, i) => {
          return <li key={i}><Link to={{pathname: `/id/${t.id}`, state: {pageId: t.id}}}>{t.label}</Link></li>
        }) )
      } else if (object_properties.has_member) {
        return (object_properties.has_member.map((t, i) => {
          return <li key={i}><Link to={{pathname: `/id/${t.id}`, state: {pageId: t.id}}}>{t.label}</Link></li>
        }) )      
      } else return null
    }

    
    const memberOfConceptGroup = () => {
      if (type.length > 0) {
        return (type.map((t, i) => <li key={i}><Link to={{pathname: `/id/${Topics[t].id}`}}>{t}</Link></li>))
      } else if (object_properties.member_of) {
        return <li><Link to={{pathname: `/id/${object_properties.member_of[0].id}`}}>{object_properties.member_of[0].label}</Link></li>
      } else if (sub_class_of.length > 0) {
        return (sub_class_of.map((t, i) => {
          return <li key={i}><Link to={{pathname: `/id/${t.id}`, state: {pageId: t.id}}}>{t.label}</Link></li>
        }) )      
      } else return null
    }

    return (
      <div>
        <div className="breadcrumb">

          <h4><Link to={{pathname: `/`}}>ITA Thesaurus</Link> > </h4>

          {(type.length > 0) ? (<h3><Link to={{pathname: `/id/${Topics[type[0]].id}`}}>{type[0]}</Link> > </h3>) : null} 
          
          {subTopic()}                              
          
          <h1>{label}</h1>
        </div>

        <div className="termInfo">
          <span><h3>Term Information</h3></span>
          <p><b>Preferred Term: </b>{annotations.pref_label}</p>
          {annotations.alt_label ? (<p><b>Alternative term: </b>{annotations.alt_label}</p>) : null}
          {description()}
          <p><b>Term Source: </b>{annotations.source}</p>
        </div>
        <div className="termRelation">
          <span><h3>Term Relationships</h3></span>
          <div className="broader">
            <b><p>Broader terms: </p></b>
            <ul>
              {object_properties.has_broader ? (object_properties.has_broader.map((t, i) => {
                return <li key={i}><Link to={{pathname: `/id/${t.id}`, state: {pageId: t.id}}}>{t.label}</Link></li>
              }) ) : null }
            </ul>
          </div>
          
          <img src={arrow} alt="arrow pointing right"/>

          <div className="related">
            <b><p>Related terms: </p></b>
            <ul>
              {object_properties.has_related ? (object_properties.has_related.map((t, i) => {
                return <li key={i}><Link to={{pathname: `/id/${t.id}`, state: {pageId: t.id}}}>{t.label}</Link></li>
              }) ) : null}
            </ul>
          </div>

          <img src={arrow} alt="arrow pointing right"/>

          <div className="narrower">
            <b><p>Narrower Terms: </p></b>
            <ul>
              {narrowerTerms()}
            </ul>
          </div>
        </div>

        <hr/>

        <div className="superTerms">
          {memberOfConceptGroup() ? (
            <>
              <b><p>Member of Concept Group: </p></b>
              <ul>
                {memberOfConceptGroup()}
              </ul>
            </>
          ) : null}
        
          {object_properties.is_top_concept_in_scheme ? (
            <p><b>Top Term of: </b> {object_properties.is_top_concept_in_scheme.map((t, i) => {
              return (<Link key={i} to={{pathname: `/`}}>{t.label}</Link>) })}</p> ) : null }
          
          {(object_properties.micro_thesaurus_of) ? (
            <p><b>Microthesaurus of: </b>
            <Link to={{pathname: `/`}}>{object_properties.micro_thesaurus_of[0].label}</Link></p>
          ) : null }

        </div>
        <Footer json={this.state.item}/>
      </div>
    );
  }
}

export default withRouter(TermInfo);