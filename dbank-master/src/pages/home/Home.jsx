import React, { useState } from "react";
import "./Home.scss";
import NewProject from "../newProject/NewProject";
import { Link } from "react-router-dom";

const Home = ({ projects, polly15, LOPx, account }) => {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const goToDetails = () => {};
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="dao-home">
      <div className="doa-home-proposals">
        <div className="doa-home-proposal">Proposal ({projects.length})</div>
        <div className="doa-home-proposal">
          <div className="">Kilopi D.A.O Governance</div>
          <div className="dao-line"></div>
        </div>
        <button
          onClick={handleClickOpen}
          className="doa-home-proposal new-proposal-btn"
        >
          Create New Proposal
        </button>
      </div>

      <div className="dao-home-container">
        <div className="dao-home-headers">
          <span className="doa-home-h-text">name</span>
          <span className="doa-home-h-text">Start Date</span>
          <span className="doa-home-h-text">Finish Date</span>
          <span className="doa-home-h-text">UpVote</span>
          <span className="doa-home-h-text">DownVote</span>
          <span className="doa-home-h-text">Status</span>
          <span className="doa-home-h-text"></span>
        </div>
        <div className="doa-home-projects">
          {projects.map((project) => {
            return (
              <div className="doa-home-project" key={project.id}>
                <div className="d-name name">{project.title}</div>
                <div className="d-name start">{project.start}</div>
                <div className="d-name finish">{project.finish}</div>
                <div className="d-name upvote">{project.upvote}</div>
                <div className="d-name dowvote">{project.downvote}</div>
                <div
                  className={
                    project.status == "Active"
                      ? "d-name active "
                      : "d-name approve"
                  }
                >
                  {project.status}
                </div>
                <Link
                  to={`/new-project/${project.id}`}
                  className="d-project-btn"
                >
                  <button onClick={goToDetails}>Details</button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
      {/*  */}
      <NewProject
        open={open}
        handleClose={handleClose}
        polly15={polly15}
        LOPx={LOPx}
        account={account}
      />
    </div>
  );
};

export default Home;
