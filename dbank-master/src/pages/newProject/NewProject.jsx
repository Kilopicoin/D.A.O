import React, { forwardRef, useEffect, useState } from "react";
import "./NewProject.scss";
import Dialog from "@mui/material/Dialog";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Slide from "@mui/material/Slide";
import { pollyadresi } from "../../utils/varialbes";
import { Alert, AlertTitle } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
// varialbes
const voteAmount = 1000;
const voteAmountx = 1000;
function NewProject({ open, handleClose, LOPx, polly15, account }) {
  const [proposalTitle, setProposalTitle] = useState("");
  const [proposalContent, setProposalContent] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  // add new proposal
  const addProposal = async (e) => {
    setErrorMessage(null);
    e.preventDefault();
    if (!proposalTitle && !proposalContent) {
      return alert("you must filled all the required field");
    }
    const { ethereum } = window;
    if (typeof ethereum === "undefined" || !account) {
      return;
    }
    const active = await polly15.methods.active().call();
    const balansi = await LOPx.methods.balanceOf(account).call();
    if (active === "1") {
      setErrorMessage(
        "There is already an active proposal",
        "It should be finalized first"
      );
    } else if (balansi < 50000000000000) {
      setErrorMessage(
        "You need 50.000.000,00 LOP tokens to create a new proposal"
      );
    } else {
      try {
        const trnsfrAmnt = 50000000 * 1000000;
        const hak = await LOPx.methods.allowance(account, pollyadresi).call();

        if (hak === "0") {
          await LOPx.methods.approve(pollyadresi, trnsfrAmnt).send({
            from: account,
            gasPrice: 101000000000,
          });
          await polly15.methods
            .addProposal(proposalTitle, proposalContent)
            .send({
              from: account,
              gasPrice: 101000000000,
            });
          window.location.reload();
        } else {
          await LOPx.methods.increaseAllowance(pollyadresi, trnsfrAmnt).send({
            from: account,
            gasPrice: 101000000000,
          });
          await polly15.methods
            .addProposal(proposalTitle, proposalContent)
            .send({
              from: account,
              gasPrice: 101000000000,
            });
          window.location.reload();
        }
      } catch (error) {
        setErrorMessage("some unknown error acrurred please try again");
      }
    }
  };
  useEffect(() => {
    console.log(account, LOPx, polly15);
  }, []);

  return (
    <div className="project-pop-up">
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        keepMounted
        scroll={"body"}
      >
        <div className="project-pop-up-info">
          <InfoOutlinedIcon className="project-pop-up-info-icon" />
          <div className="project-pop-up-info-text">
            <span>
              Creating a new proposal requires <strong>50.000.000,00</strong>{" "}
              LOP tokens.
            </span>
            <span>
              You will automatically receive your (
              <strong>50.000.000,00 + Proposal Prize Share</strong> ) LOP tokens
              once the proposal gets finalized ( Approved or Declined )
            </span>
          </div>
        </div>
        {errorMessage && (
          <div className="y-error-m-c">
            <Alert severity="error" className="y-error-m">
              <AlertTitle>Error</AlertTitle>
              {errorMessage}
            </Alert>
          </div>
        )}

        <form onSubmit={addProposal} className="project-form">
          <div className="project-form-c">
            <label className="projec-f-label">Title</label>
            <input
              type="text"
              className="project-form-input"
              value={proposalTitle}
              onChange={(e) => setProposalTitle(e.target.value)}
            />
          </div>
          <div className="project-form-c">
            <label className="projec-f-label">Content</label>
            <textarea
              rows="8"
              placeholder="Enter a very detailed description of your proposal"
              className="project-form-textarea"
              value={proposalContent}
              onChange={(e) => setProposalContent(e.target.value)}
            ></textarea>
          </div>

          <input
            type="submit"
            value="Submit Proposal"
            className="project-submit"
          />
          <div className=""></div>
        </form>
      </Dialog>
    </div>
  );
}

export default NewProject;
