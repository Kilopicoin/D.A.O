import React from 'react'
import Table from './Table'

class Content extends React.Component {
  render() {
    return (
      <div>
        <Table ProjectNo={this.props.ProjectNo} selectproposal = {this.props.selectproposal}/>
        <hr/>
       
      </div>
    )
  }
}

export default Content;
