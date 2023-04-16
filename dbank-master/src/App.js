import React, { Component } from "react";
import Polly15 from "./abis/Polly15.json";
import LOP from "./abis/LOP.json";
import Web3 from "web3";
import Home from "./pages/home/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Details from "./pages/details/Details";
import { pollyadresi, tokenadresi, HMY_RPC_URL } from "./utils/varialbes";
import "./App.scss";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ProjectNo: [],
      polly15: null,
      LOPx: null,
      account: null,
      balance: "",
      web3: null,
    };
  }

  async componentWillMount() {
    await this.loadBlockchainData();
    this.fetchData();
  }

  async loadBlockchainData() {
    if (typeof window.ethereum === "undefined") {
      window.alert("Please install MetaMask");
      const web3 = new Web3(HMY_RPC_URL);

      const polly15 = new web3.eth.Contract(Polly15.abi, pollyadresi);
      const LOPx = new web3.eth.Contract(LOP.abi, tokenadresi);
      this.setState({ polly15: polly15 });
      this.setState({ LOPx: LOPx });
    } else {
      const web3 = new Web3(window.ethereum);
      window.ethereum.enable();
      const accounts = await web3.eth.getAccounts();

      //load balance
      if (typeof accounts[0] !== "undefined") {
        const balance = await web3.eth.getBalance(accounts[0]);
        this.setState({ account: accounts[0], balance: balance, web3: web3 });

        const polly15 = new web3.eth.Contract(Polly15.abi, pollyadresi);
        const LOPx = new web3.eth.Contract(LOP.abi, tokenadresi);
        this.setState({ polly15: polly15 });
        this.setState({ LOPx: LOPx });
      } else {
        window.alert("Please login with MetaMask");
        const web3 = new Web3(HMY_RPC_URL);
        const polly15 = new web3.eth.Contract(Polly15.abi, pollyadresi);
        const LOPx = new web3.eth.Contract(LOP.abi, tokenadresi);
        this.setState({ polly15: polly15 });
        this.setState({ LOPx: LOPx });
      }
    }
  }

  async fetchData() {
    const proposalCount = await this.state.polly15.methods
      .proposalCount()
      .call();

    for (var i = 1; i <= proposalCount; i++) {
      const project_tmp = await this.state.polly15.methods.proposals(i).call();

      const comments_tmp = await this.state.polly15.methods
        .commentsOf(i)
        .call();

      const ProjectNo = [...this.state.ProjectNo];
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

      if (project_tmp.status !== "0") {
        ProjectNo.push({
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
        });
      }

      //			const datax = ProjectNo2.reduce((a,v) =>  a = a + v.burnt , 0 )
      //			this.setState({datax:datax})

      ProjectNo.sort((a, b) => {
        if (a.id < b.id) {
          return 1;
        }
        if (a.id > b.id) {
          return -1;
        }
        return 0;
      });

      this.setState({ ProjectNo: ProjectNo });
    }
  }

  render() {
    return (
      <div className="">
        <div className="">
          <BrowserRouter>
            <Routes>
              <Route
                path="new-project/:id"
                element={
                  <Details
                    polly15={this.state.polly15}
                    LOPx={this.state.LOPx}
                    account={this.state.account}
                  />
                }
              />
              <Route
                path="/"
                element={
                  <Home
                    projects={this.state.ProjectNo}
                    polly15={this.state.polly15}
                    LOPx={this.state.LOPx}
                    account={this.state.account}
                  />
                }
              />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    );
  }
}

export default App;
