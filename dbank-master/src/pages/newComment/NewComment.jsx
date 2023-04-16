import React, { forwardRef, useState } from "react";
import "./NewComment.scss";
import Dialog from "@mui/material/Dialog";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Slide from "@mui/material/Slide";
import { pollyadresi } from "../../utils/varialbes";
import { Alert, AlertTitle } from "@mui/material";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function NewComment({ open, handleClose, polly15, LOPx, account, status, id }) {
  const [comment, setComment] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  // add new comment
  const addComment = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!comment) {
      return alert("you must write some comment");
    }
    const { ethereum } = window;
    if (typeof ethereum === "undefined" || !account) {
      return;
    }
    const balansi = await LOPx.methods.balanceOf(account).call();

    if (status !== "Active") {
      setErrorMessage(
        "This proposal is not active",
        "Voting and commenting to this proposal have been finalized"
      );
    } else if (balansi < 100000000000) {
      setErrorMessage(
        "You need 100.000,00 LOP tokens to comment on a proposal"
      );
    } else {
      try {
        const trnsfrAmnty = 100000 * 1000000;
        const hak = await LOPx.methods.allowance(account, pollyadresi).call();

        if (hak === "0") {
          await LOPx.methods.approve(pollyadresi, trnsfrAmnty).send({
            from: account,
            gasPrice: 101000000000,
          });
          polly15.methods.addComment(id, comment).send({
            from: account,
            gasPrice: 101000000000,
          });
          window.location.reload();
        } else {
          await LOPx.methods.increaseAllowance(pollyadresi, trnsfrAmnty).send({
            from: account,
            gasPrice: 101000000000,
          });
          polly15.methods.addComment(id, comment).send({
            from: account,
            gasPrice: 101000000000,
          });

          window.location.reload();
        }
      } catch (error) {
        console.log(error);
        setErrorMessage("something went wrong please try again");
      }
    }
  };
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
              Commenting on a proposal requires <strong>100.000,00</strong> LOP
              tokens.
            </span>
            <span>
              You will automatically receive your (
              <strong>100.000,00 + Proposal Prize Share</strong> ) LOP tokens
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
        <form onSubmit={addComment} className="project-form">
          <div className="project-form-c">
            <label className="projec-f-label">Message</label>
            <textarea
              rows="8"
              placeholder="Enter a your comment"
              className="project-form-textarea"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
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

export default NewComment;
