import React, { useEffect, useState } from "react";
import "./details.scss";
import Web3 from "web3";
import Polly15 from "../../abis/Polly15.json";
import { Link, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Pic from "../../utils/pic2.svg";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NewComment from "../newComment/NewComment";
import { HMY_RPC_URL, pollyadresi, tokenadresi } from "../../utils/varialbes";
import { Button, Dialog, DialogActions } from "@mui/material";

function Details({ polly15, LOPx, account }) {
  const [contract, setContract] = useState(null);
  const [project, setProject] = useState({});
  const [comments, setComments] = useState([]);
  const [open, setOpen] = useState(false);
  const [openMessage, setOpenMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleMessageClose = () => {
    setOpenMessage(false);
  };
  const params = useParams();

  useEffect(() => {
    connectWallet();
  }, []);

  const connectWallet = async () => {
    const { ethereum } = window;
    if (typeof ethereum === "undefined") {
      alert("Please install MEetamask");
      const web3 = new Web3(HMY_RPC_URL);
      const polly15_ = new web3.eth.Contract(Polly15.abi, pollyadresi);
      getData(polly15_);
      setContract(polly15_);
    } else {
      try {
        const web3 = new Web3(ethereum);
        window.ethereum.enable();

        const accounts = await web3.eth.getAccounts();

        //load balance
        if (typeof accounts[0] !== "undefined") {
          const balance_ = await web3.eth.getBalance(accounts[0]);

          const polly15_ = new web3.eth.Contract(Polly15.abi, pollyadresi);

          getData(polly15_);
          setContract(polly15_);
        } else {
          window.alert("Please login with MetaMask");

          const web3 = new Web3(HMY_RPC_URL);

          const polly15_ = new web3.eth.Contract(Polly15.abi, pollyadresi);

          getData(polly15_);
          setContract(polly15_);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const getData = async (polly15) => {
    const i = Number(params.id);
    const project_tmp = await polly15.methods.proposals(i).call();

    const comments_tmp = await polly15.methods.commentsOf(i).call();
    let startDatex = parseInt(project_tmp.startTime);
    startDatex = startDatex * 1000;
    let finishDatey = parseInt(project_tmp.finishTime);
    finishDatey = finishDatey * 1000;

    let startDate = new Intl.DateTimeFormat(["ban", "id"], {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(startDatex);
    let finishDate = new Intl.DateTimeFormat(["ban", "id"], {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(finishDatey);

    let status = "Passive";

    if (project_tmp.status === "1") {
      status = "Active";
    } else if (project_tmp.status === "2") {
      status = "Approved";
    } else if (project_tmp.status === "3") {
      status = "Declined";
    }
    const project_ = {
      id: project_tmp.id,
      title: project_tmp.title,
      start: startDate,
      finish: finishDate,
      upvote: project_tmp.upvote,
      downvote: project_tmp.downvote,
      status: status,
      commentNo: project_tmp.commentNo,
      content: project_tmp.content,
      proposer: project_tmp.proposer,
      prize: project_tmp.prize / 1000000,
    };
    orderComments(comments_tmp);
    setProject(project_);
  };
  if (!project) {
    return <div className="">Loading</div>;
  }
  const orderComments = (comments_) => {
    let temp_comments = [];
    for (let i = 0; i < comments_[0].length; i++) {
      temp_comments.push({
        id: comments_[0][i],
        address: comments_[1][i],
        content: comments_[2][i],
      });
    }
    setComments(temp_comments);
  };
  // upvote
  const addupVote = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    const { ethereum } = window;
    if (typeof ethereum === "undefined" || !account) {
      return;
    }
    const balansi = await LOPx.methods.balanceOf(account).call();
    console.log(balansi);
    if (project.status !== "Active") {
      setErrorMessage(
        "This proposal is not active. Voting and commenting to this proposal have been finalized"
      );
      setOpenMessage(true);
    } else if (balansi < 10000000000) {
      setErrorMessage("You need 10.000,00 LOP tokens to vote for a proposal");
      setOpenMessage(true);
    } else {
      try {
        const trnsfrAmntx = 10000 * 1000000;
        const hakx = await LOPx.methods.allowance(account, pollyadresi).call();

        if (hakx === "0") {
          await LOPx.methods.approve(pollyadresi, trnsfrAmntx).send({
            from: account,
            gasPrice: 101000000000,
          });
          await polly15.methods.upVote(project.id).send({
            from: account,
            gasPrice: 101000000000,
          });
          setSuccessMessage("upvoted successfully");
          setOpenMessage(true);
        } else {
          await LOPx.methods.increaseAllowance(pollyadresi, trnsfrAmntx).send({
            from: account,
            gasPrice: 101000000000,
          });
          await polly15.methods.upVote(project.id).send({
            from: account,
            gasPrice: 101000000000,
          });
          setSuccessMessage("upvoted successfully");
          setOpenMessage(true);
        }
      } catch (error) {
        console.log(error);
        setErrorMessage("something went wrong");
        setOpenMessage(true);
      }
    }
  };
  const adddownVote = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    const { ethereum } = window;
    if (typeof ethereum === "undefined" || !account) {
      return;
    }
    const balansi = await LOPx.methods.balanceOf(account).call();

    if (project.status !== "Active") {
      setErrorMessage(
        "This proposal is not active. Voting and commenting to this proposal have been finalized"
      );
      setOpenMessage(true);
    } else if (balansi < 10000000000) {
      setErrorMessage("You need 10.000,00 LOP tokens to vote for a proposal");
      setOpenMessage(true);
    } else {
      try {
        const trnsfrAmntx = 10000 * 1000000;
        const hakx = await LOPx.methods.allowance(account, pollyadresi).call();

        if (hakx === "0") {
          await LOPx.methods.approve(pollyadresi, trnsfrAmntx).send({
            from: account,
            gasPrice: 101000000000,
          });
          await polly15.methods.downVote(project.id).send({
            from: this.state.account,
            gasPrice: 101000000000,
          });
          setSuccessMessage("downvoted successfully");
          setOpenMessage(true);
        } else {
          await LOPx.methods.increaseAllowance(pollyadresi, trnsfrAmntx).send({
            from: account,
            gasPrice: 101000000000,
          });
          await polly15.methods.downVote(project.id).send({
            from: account,
            gasPrice: 101000000000,
          });
          setSuccessMessage("downvoted successfully");
          setOpenMessage(true);
        }
      } catch (error) {
        console.log(error);
        setErrorMessage("something went wrong");
        setOpenMessage(true);
      }
    }
  };
  return (
    <div className="detail">
      <div className="detail-container">
        <div className="details-header">
          <Link to={"/"} className="d-h-left">
            <ArrowBackIcon className="d-h-icon" />
            <span className="d-h-text">All Proposals</span>
          </Link>
          <button className="d-h-middle" onClick={handleClickOpen}>
            Comment
          </button>
          <button className="d-h-right">{project?.status}</button>
        </div>
        <div className="detail-section-0">
          <div className="detail-section-left">
            <img src={Pic} alt="" />
          </div>
          <div className="detail-section-right">
            <div className="detail-section-1">
              <div className="detail-section-1-label">Proposer</div>
              <div className="detail-section-1-name">{project?.proposer}</div>
            </div>
            <div className="detail-section-1">
              <div className="detail-section-1-label">Proposal Title</div>
              <div className="detail-section-1-name">{project.title}</div>
            </div>
            {/*  */}
            <div className="detail-section-2-content">
              <span className="detail-s-2-s-1">Proposal id:</span>
              <span className="detail-s-2-s-2 ">{project?.id}</span>
            </div>
            {/*  */}
            <div className="detail-section-2-content">
              <span className="detail-s-2-s-1">Upvote:</span>
              <span className="detail-s-2-s-2">{project?.upvote}</span>
            </div>
            {/*  */}
            <div className="detail-section-2-content">
              <span className="detail-s-2-s-1">Downvote:</span>
              <span className="detail-s-2-s-2">{project?.downvote}</span>
            </div>
            {/*  */}
            <div className="detail-section-2-content">
              <span className="detail-s-2-s-1">PrizePool</span>
              <span className="detail-s-2-s-2">
                {project?.prize},00 LOP tokens
              </span>
            </div>
            {/*  */}
            <div className="detail-section-2-content">
              <span className="detail-s-2-s-1">StartDate:</span>
              <span className="detail-s-2-s-2">{project?.start} </span>
            </div>
            {/*  */}
            <div className="detail-section-2-content">
              <span className="detail-s-2-s-1">FinishDate:</span>
              <span className="detail-s-2-s-2">{project?.finish} </span>
            </div>
            <div className="detail-voting-section-3">
              <button className="detail-v-btn" onClick={addupVote}>
                UpVote
              </button>
              <button className="detail-v-btn" onClick={adddownVote}>
                DownVote
              </button>
            </div>
          </div>
        </div>

        <div className="detail-summary-section-4">
          <div className="summary-header">Proposal Content</div>
          <div className="detail-summary-content">{project?.content}</div>
        </div>
        <div className="detail-comments-section-5">
          <div className="detail-comments-section-5-head">
            Comments ({comments.length})
          </div>
          {comments.map((comment) => {
            return (
              <div key={comment.id} className="">
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                    className="accordion-head"
                  >
                    <Typography className="Typography">
                      {comment.address}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails className="accordion-body">
                    <Typography>{comment.content}</Typography>
                  </AccordionDetails>
                </Accordion>
              </div>
            );
          })}
        </div>
      </div>
      {/*  */}
      <NewComment
        open={open}
        handleClose={handleClose}
        polly15={polly15}
        LOPx={LOPx}
        account={account}
        status={project?.status}
        id={project.id}
      />
      <Dialog
        className="message-dialog"
        open={openMessage}
        onClose={handleClose}
      >
        {errorMessage && <div className="m-d-content">{errorMessage}</div>}
        {successMessage && <div className="m-d-content">{successMessage}</div>}

        <DialogActions>
          {errorMessage && <Button onClick={handleMessageClose}>Ok</Button>}
          {successMessage && (
            <Button onClick={() => window.location.reload()}>Ok</Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Details;
