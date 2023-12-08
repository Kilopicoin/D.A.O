// SPDX-License-Identifier: MIT

pragma solidity ^0.8.22;

interface IHarmLop {
    function totalSupply() external view returns (uint);
    function balanceOf(address who) external view returns (uint);
    function approve(address spender, uint value) external returns (bool);
    function transfer(address to, uint value) external returns (bool);
    function transferFrom(address from, address to, uint value) external returns (bool);
    function burn(uint value) external returns (bool);
}

contract DaoNew {

    struct Topic{
        uint256 status; // 1 for active, 2 for passive
        string title;
        string content;
        address starter;
        uint256 startTime;
        uint256 finishTime;
        uint256 commentNo;
        uint256 tokeni;
    }

    struct Comment{
        address commenter;
        string content;
        uint256 tokeni;
        uint256 startTime;
        uint256 finishTime;
    }

    IHarmLop public token;
    bool public statusWorld;

    uint256 public TopicCount;
    uint256 public TopicCountAktif;

    mapping (uint256 => Topic) public Topics;
    mapping (uint256 => mapping (uint256 => Comment)) public comments;

    address public owner;
    address public owner2;

    constructor (IHarmLop _token, address adres) {
       owner = msg.sender;
       token = _token;
       statusWorld = false;
       owner2 = adres;
    }

    function addTopic(string memory titlex_, string memory contentx_, uint256 tokenMiktari) public {
    
        require(statusWorld, "W P");

        require(TopicCountAktif < 11, "Aktif konu miktari");

        require(tokenMiktari >= 100000000000, "must be more than 100k");
        require(tokenMiktari <= 10000000000000, "must be less than 10m");

        require(token.balanceOf(address(msg.sender)) >= tokenMiktari, "must be more than request");

        token.transferFrom(msg.sender,(address(this)),tokenMiktari);
        TopicCount++;
        Topics[TopicCount] = Topic(1,titlex_,contentx_,msg.sender,block.timestamp,0,0,tokenMiktari); 

        TopicCountAktif += 1;

    }

    function addComment(uint256 toidy_, string memory contenty_, uint256 tokenMiktari) public {

        require(statusWorld, "W P");

        if ( msg.sender == owner2 ) {

            require(Topics[toidy_].status == 1, "proposal not active");

        } else {

            require(tokenMiktari >= 10000000000, "must be more than 10k");
            require(tokenMiktari <= 1000000000000, "must be less than 1m");

            require(token.balanceOf(address(msg.sender)) >= tokenMiktari, "must be more than request");

            require(Topics[toidy_].status == 1, "proposal not active");

            token.transferFrom(msg.sender,(address(this)),tokenMiktari);

        }

        Topics[toidy_].commentNo++;
        comments[toidy_][Topics[toidy_].commentNo].commenter = msg.sender;
        comments[toidy_][Topics[toidy_].commentNo].content = contenty_;
        comments[toidy_][Topics[toidy_].commentNo].tokeni = tokenMiktari;
        comments[toidy_][Topics[toidy_].commentNo].startTime = block.timestamp;    
        
	}

    function GetTokensBack(uint256 toidy_, uint256 commentNox) public {

        if ( commentNox == 0 ) {

            require(block.timestamp > (Topics[toidy_].startTime + 2592000), "1 Ay sure");
            require(msg.sender == Topics[toidy_].starter, "Address Not Match");
            require(token.transfer(msg.sender, Topics[toidy_].tokeni));
            Topics[toidy_].tokeni = 0;

        } else {

            require(block.timestamp > (comments[toidy_][commentNox].startTime + 2592000), "1 Ay sure");
            require(msg.sender == comments[toidy_][commentNox].commenter, "Address Not Match");
            require(token.transfer(msg.sender, comments[toidy_][commentNox].tokeni));
            comments[toidy_][commentNox].tokeni = 0;

        }


	}

    function Finalize(uint256 toidy_) public {

        require(msg.sender == owner2, "Only owner2");

        require(Topics[toidy_].status == 1, "proposal not active");

        Topics[toidy_].status = 2;
        TopicCountAktif -= 1;

	}


    function changeOwner2(address newowner2) public {

        require(msg.sender == owner, "Only owner");

        owner2 = newowner2;

	}

    function icerikMudahele (uint256 toidy_, uint256 commentNox) public {

        require(msg.sender == owner2, "Only owner2");

        if ( commentNox == 0 ) {

            require(token.burn(Topics[toidy_].tokeni));
            Topics[toidy_].content = "Canceled due to inappropriate or incorrect content";
            Topics[toidy_].tokeni = 0;


        } else {

            require(token.burn(comments[toidy_][commentNox].tokeni));
            comments[toidy_][commentNox].content = "Canceled due to inappropriate or incorrect content";
            comments[toidy_][commentNox].tokeni = 0;

        }


	}





}