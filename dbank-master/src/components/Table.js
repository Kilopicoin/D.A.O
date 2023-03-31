import React from 'react'
import './Appx.css';

class Table extends React.Component {
  render() {
    return (
      <table className='table'>
        <thead>
          <tr className='trx'>
            <th>No</th>
            <th>Title</th>
            <th>Start Date</th>
			<th>Finish Date</th>
			<th>UpVote</th>
			<th>DownVote</th>
			<th>Status</th>
			<th>Details</th>

          </tr>
        </thead>
        <tbody >
          {this.props.ProjectNo.map((Project) => {
            return(
              <tr key={Project.id}>
                <th>{Project.id}</th>
                <td>{Project.title}</td>
                <td>{Project.start}</td>
				<td>{Project.finish}</td>
				<td>{Project.upvote}</td>
				<td>{Project.downvote}</td>
				<td>{Project.status}</td>
				<td>
				
				
				
				<button className='btn btn-warning' onClick={(event) => {
                                                                       event.preventDefault()
																	   this.props.selectproposal(Project.id, Project.content, 
																	   Project.start, Project.finish, Project.upvote, 
																	   Project.downvote, Project.status, Project.title,  Project.commentNo, Project.comments, Project.proposer, Project.prize)
																	   
                                                                     }  }>Detail
                  </button>
				  
				  
				  </td>

              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }
}

export default Table;