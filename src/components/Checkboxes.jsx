import React, { Component } from "react";
import { Checkbox } from "@material-ui/core";
import { Link, withRouter } from 'react-router-dom'; 
import topics from './topics';

class Checkboxes extends Component {

  render() {

    const {
      items,
      name,
      checkedListAll,
      handleCheckboxClick,
    } = this.props;

    const getItems = items.map(item => {
      return item;
    });

    return (
      <div className={name}>
        {getItems.map(item => {
          return (
            <div key={item.value}>
              <label>
                <Checkbox
                  item={item}
                  value={item.value}
                  checked={checkedListAll.includes(item.value)}
                  onChange={handleCheckboxClick}
                  color="primary"
                /><Link to={{pathname: `/id/${topics[item.value].id}`}}>{item.name}</Link>
              </label>
            </div>
          );
        })}
      </div>
    );
  }
}

export default withRouter(Checkboxes);