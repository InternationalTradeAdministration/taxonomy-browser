import React, {Component} from 'react';

class Checkbox extends Component {
  constructor() {
    super()
    this.state = {
      checked: false,
    }
  }

  render() {
    return (
      <input type="checkbox" name={this.props.name} value={this.props.value}/>
    )
  }
}

export default Checkbox;