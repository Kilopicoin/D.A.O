// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;
pragma experimental ABIEncoderV2;

interface IHRC20 {
  function transfer(address to, uint256 value) external returns (bool);
  function approve(address spender, uint256 value) external returns (bool);
  function increaseAllowance(address spender, uint256 addedValue) external returns (bool);
  function transferFrom(address from, address to, uint256 value) external returns (bool);
  function totalSupply() external view returns (uint256);
  function balanceOf(address who) external view returns (uint256);
  function allowance(address owner, address spender) external view returns (uint256);
  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract Dao1{

struct balancexs{
    address payable adresxs;
    uint256 balancexs;
}

struct Comment{
    address commenter;
    string content;
}

    struct Proposal{
        uint256 id;
        uint256 status; // 1 for active, 2 for approved, 3 for declined
        uint256 upvote;
        uint256 downvote;
        string title;
        string content;
        address proposer;
        uint256 startTime;
        uint256 finishTime;
        uint256 commentNo;
        uint256 prize;
    }


mapping (uint256 => Proposal) public proposals;
mapping (uint256 => mapping (uint256 => Comment)) public comments;
mapping (uint256 => balancexs) public balancex;

	IHRC20 public token;
	address public owner;
	string title_;
	string content_;
	string content__;
	uint256 toid_;
  uint256 toidu_;
  uint256 toidd_;
  uint256 toiddxyzax_;
  uint256 xyzaprizex_;
  uint256 public active; // 0 for passive, 1 for active
  uint256 public activebalancex;
  uint256 public balancexcount;
//	uint256 toidy;
//	uint256 ProjectNum_;
//  uint256 miktar_;
//	uint256 miktarr_;
//	address payable public blackHole;
//	address payable public whiteHole;
	
	constructor (IHRC20 _token) public {
       owner = msg.sender;
	   //blackHole = black;
	   //whiteHole = white;
       token = _token;
       active = 0;
       balancexcount = 0;
       activebalancex = 0;
    }
   
	event e_addProposal(address indexed e_recorder, string e_title);
	event e_addComment(address indexed e_recorder, uint256 e_id);
  event e_upVote(address indexed e_recorder, uint256 e_id);
  event e_downVote(address indexed e_recorder, uint256 e_id);
//	event e_publishProject(address indexed e_publisher, string e_project);
//	event e_addTx(address indexed e_publisher, string e_project);
	
	uint256 public proposalCount;
	
//	mapping (uint256 => Project) public ProjectNo;
	
	receive() external payable {
        addProposal(title_, content_);
	//	publishProject(ProjectNum_, linkx_);
	    	addComment(toid_, content__);
        upVote(toidu_);
        downVote(toidd_);
        prizeadd(toiddxyzax_, xyzaprizex_);
	//	addTx(toidy, linky);
    }
	
function addProposal(string memory titlex_, string memory contentx_) payable public {
  require(active == 0, "contract should be passive");
  require(token.balanceOf(address(msg.sender)) > 49999999999999, "must be more than 50 millions");
  token.transferFrom(msg.sender,(address(this)),50000000000000);
  proposalCount++;
  proposals[proposalCount] = Proposal(proposalCount,1,0,0,titlex_,contentx_,msg.sender,now,now+2592000,0,0);
  active = 1;

  balancex[balancexcount].adresxs = msg.sender;
  balancex[balancexcount].balancexs = 50000000000000;
  balancexcount++;
  activebalancex = activebalancex + 50000000000000;

  emit e_addProposal(msg.sender, titlex_);
}

	function addComment(uint256 toidy_, string memory contenty_) payable public {
    require(token.balanceOf(address(msg.sender)) > 99999999999, "must be more than 100 k");
    require(proposals[toidy_].status == 1, "proposal not active");
    token.transferFrom(msg.sender,(address(this)),100000000000);
    comments[toidy_][proposals[toidy_].commentNo].commenter = msg.sender;
    comments[toidy_][proposals[toidy_].commentNo].content = contenty_;
    proposals[toidy_].commentNo++;

    balancex[balancexcount].adresxs = msg.sender;
    balancex[balancexcount].balancexs = 100000000000;
    balancexcount++;
    activebalancex = activebalancex + 100000000000;

    emit e_addComment(msg.sender, toidy_);
		}


function upVote(uint256 toidux_) payable public {
  require(token.balanceOf(address(msg.sender)) > 9999999999, "must be more than 10 k");
  require(proposals[toidux_].status == 1, "proposal not active");
  token.transferFrom(msg.sender,(address(this)),10000000000);
  proposals[toidux_].upvote++;

  balancex[balancexcount].adresxs = msg.sender;
  balancex[balancexcount].balancexs = 10000000000;
  balancexcount++;
  activebalancex = activebalancex + 10000000000;

  if ( now > proposals[toidux_].finishTime) {
    if (proposals[toidux_].upvote > proposals[toidux_].downvote) {
        proposals[toidux_].status = 2;
        active = 0;

        uint256 aktifbalans = activebalancex;
        uint256 prizex = proposals[toidux_].prize;
        uint256 pool = aktifbalans + prizex;

        for(uint i=0; i<balancexcount; i++){

        address payable gonderilecekadres = balancex[i].adresxs;

        uint256 balans = balancex[i].balancexs;
        uint256 gonderilecekmiktarx = balans * pool;
        uint256 gonderilecekmiktary = gonderilecekmiktarx / aktifbalans;
        uint256 gonderilecekmiktar = gonderilecekmiktary - 1000000;

        token.transfer(gonderilecekadres, gonderilecekmiktar);
        delete balancex[i].adresxs;
        delete balancex[i].balancexs;
         }
        balancexcount = 0;
        activebalancex = 0;

    } else if (proposals[toidux_].upvote < proposals[toidux_].downvote) {
        proposals[toidux_].status = 3;
        active = 0;

        uint256 aktifbalans = activebalancex;
        uint256 prizex = proposals[toidux_].prize;
        uint256 pool = aktifbalans + prizex;

        for(uint i=0; i<balancexcount; i++){

        address payable gonderilecekadres = balancex[i].adresxs;

        uint256 balans = balancex[i].balancexs;
        uint256 gonderilecekmiktarx = balans * pool;
        uint256 gonderilecekmiktary = gonderilecekmiktarx / aktifbalans;
        uint256 gonderilecekmiktar = gonderilecekmiktary - 1000000;

        token.transfer(gonderilecekadres, gonderilecekmiktar);
        delete balancex[i].adresxs;
        delete balancex[i].balancexs;
         }
        balancexcount = 0;
        activebalancex = 0;

      }
  }
  emit e_upVote(msg.sender, toidux_);
}


function downVote(uint256 toiddx_) payable public {
  require(token.balanceOf(address(msg.sender)) > 9999999999, "must be more than 10 k");
  require(proposals[toiddx_].status == 1, "proposal not active");
  token.transferFrom(msg.sender,(address(this)),10000000000);
  proposals[toiddx_].downvote++;

  balancex[balancexcount].adresxs = msg.sender;
  balancex[balancexcount].balancexs = 10000000000;
  balancexcount++;
  activebalancex = activebalancex + 10000000000;

  if ( now > proposals[toiddx_].finishTime) {
    if (proposals[toiddx_].upvote > proposals[toiddx_].downvote) {
        proposals[toiddx_].status = 2;
        active = 0;

        uint256 aktifbalans = activebalancex;
        uint256 prizex = proposals[toiddx_].prize;
        uint256 pool = aktifbalans + prizex;

        for(uint i=0; i<balancexcount; i++){

        address payable gonderilecekadres = balancex[i].adresxs;

        uint256 balans = balancex[i].balancexs;
        uint256 gonderilecekmiktarx = balans * pool;
        uint256 gonderilecekmiktary = gonderilecekmiktarx / aktifbalans;
        uint256 gonderilecekmiktar = gonderilecekmiktary - 1000000;

        token.transfer(gonderilecekadres, gonderilecekmiktar);
        delete balancex[i].adresxs;
        delete balancex[i].balancexs;
         }
        balancexcount = 0;
        activebalancex = 0;


    } else if (proposals[toiddx_].upvote < proposals[toiddx_].downvote) {
        proposals[toiddx_].status = 3;
        active = 0;

        uint256 aktifbalans = activebalancex;
        uint256 prizex = proposals[toiddx_].prize;
        uint256 pool = aktifbalans + prizex;

        for(uint i=0; i<balancexcount; i++){
        
        address payable gonderilecekadres = balancex[i].adresxs;

        uint256 balans = balancex[i].balancexs;
        uint256 gonderilecekmiktarx = balans * pool;
        uint256 gonderilecekmiktary = gonderilecekmiktarx / aktifbalans;
        uint256 gonderilecekmiktar = gonderilecekmiktary - 1000000;

        token.transfer(gonderilecekadres, gonderilecekmiktar);
        delete balancex[i].adresxs;
        delete balancex[i].balancexs;
         }
        balancexcount = 0;
        activebalancex = 0;


      }
  }
  emit e_downVote(msg.sender, toiddx_);
}


function finishtimechange(uint256 toiddxyz_, uint256 xyztime_) payable public {
  require(msg.sender == owner, "only owner");
  require(proposals[toiddxyz_].status == 1, "proposal not active");
  proposals[toiddxyz_].finishTime = xyztime_;
}

function prizeadd(uint256 toiddxyza_, uint256 xyzaprize_) payable public {
  require(msg.sender == owner, "only owner");
  require(proposals[toiddxyza_].status == 1, "proposal not active");
  require(token.balanceOf(address(msg.sender)) > xyzaprize_, "must be more than balance");
  token.transferFrom(msg.sender,(address(this)),xyzaprize_);
  proposals[toiddxyza_].prize = proposals[toiddxyza_].prize + xyzaprize_;
}

function commentsOf(uint256 proposalxyz) public view returns (uint256[] memory, address[] memory, string[] memory)  {

      uint256[]    memory commentid = new uint256[](proposals[proposalxyz].commentNo);
      address[]  memory commenteraddress = new address[](proposals[proposalxyz].commentNo);
      string[]    memory commentcontent = new string[](proposals[proposalxyz].commentNo);

      for (uint i = 0; i < proposals[proposalxyz].commentNo; i++) {

          commentid[i] = i;
          commenteraddress[i] = comments[proposalxyz][i].commenter;
          commentcontent[i] = comments[proposalxyz][i].content;
      }

        return (commentid, commenteraddress, commentcontent);
    }

	
//	function publishProject(uint256 ProjectNum, string memory linkx) payable public {
//		require(msg.sender == owner, "only owner");
//		require(ProjectNo[ProjectNum].voted != 0, "no project name");
//		require(ProjectNo[ProjectNum].published == 0, "project not exist or published");
//		uint256 yari = ProjectNo[ProjectNum].voted / 2;
  //      token.transfer(whiteHole, yari);
    //    token.transfer(blackHole, yari);
	//	ProjectNo[ProjectNum].link = linkx;
	//	ProjectNo[ProjectNum].burnt = yari;
	//	ProjectNo[ProjectNum].published = 1;
	//	emit e_publishProject(msg.sender, ProjectNo[ProjectNum].name);
//	}
	
//	function addTx(uint256 toidy_, string memory linky_) payable public {
//		require(msg.sender == owner, "only owner");
//		require(ProjectNo[toidy_].voted != 0, "no project name");
//		require(ProjectNo[toidy_].published == 1, "project not published");
//		ProjectNo[toidy_].linkyz = linky_;
//		emit e_addTx(msg.sender, ProjectNo[toidy_].name);
//	}
	
	
}