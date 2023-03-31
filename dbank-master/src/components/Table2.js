import React from 'react'
import './Appx.css';
class Table2 extends React.Component {
	
	
	
  render() {
	  
	  
    return (
      <table className='table'>
        <thead>
          <tr className='trx'>
            <th>No</th>
			<th>Video</th>
			<th>Burnt</th>
          </tr>
        </thead>
        <tbody >
          {this.props.ProjectNo2.map((Project2) => {
            return(
              <tr key={Project2.id.toString()}>
                <th>{Project2.id}</th>
				<td><a href={Project2.link} rel="noopener noreferrer" target="_blank">{Project2.name}</a></td>
				<td><a href={Project2.linktx} rel="noopener noreferrer" target="_blank">{Project2.burnt}</a></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }
}

export default Table2;
