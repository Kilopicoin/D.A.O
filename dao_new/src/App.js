import {React, useState, useEffect} from 'react';
import './App.css';
import Swal from 'sweetalert2'; 
import Token from './res/Token.json'
import Web3 from 'web3';
import { ethers } from 'ethers'; // Import ethers.js library
import dao from './res/daoNew.json'


const daoAdres = '0x76f1640B15c372ff6dB116142044C6A5E33A1643';
const TokenAddress = '0x09e6E20FF399c2134C14232E172ce8ba2b03017E';
const ChainRPC = 'https://api.harmony.one/';



const App = () => {


  const [nav, setnav] = useState("Home");
  const [navCreate, setnavCreate] = useState(0);
  const [navAdd, setnavAdd] = useState(0);
  const [TXH, setTXH] = useState(1);
  const [Loading, setLoading] = useState(0);
  const [walletAddress, setWalletAddress] = useState(daoAdres);
  const [tokenMiktariG, settokenMiktariG] = useState(0);
  const [tokenMiktaricommentG, settokenMiktaricommentG] = useState(0);
  const [ONEbalance, setONEbalance] = useState(0);
  const [contenG, setcontenG] = useState("");
  const [commentG, setcommentG] = useState("");
  const [titleG, settitleG] = useState("");
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(true);
  const [LoadBalanceD, setLoadBalanceD] = useState(1);
  const [isMetaMaskLoggedIn, setIsMetaMaskLoggedIn] = useState(true);
  const [ProjectNo, setProjectNo] = useState([]);
  const [ProjectNo2, setProjectNo2] = useState([]);
  const [ProjectNo3, setProjectNo3] = useState([]);
  const [navActives, setnavActives] = useState(0);
  const [navPassives, setnavPassives] = useState(0);

  const [KurucuBenim, setKurucuBenim] = useState(0);

  const [topicOnViewNo, settopicOnViewNo] = useState(0);
  const [topicOnViewTitle, settopicOnViewTitle] = useState("");
  const [topicOnViewContent, settopicOnViewContent] = useState("");

  const [KurucuTokeni, setKurucuTokeni] = useState(0);





  useEffect(() => {
    const loadBalance = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          let ONEbalance = await provider.getBalance(address);
          ONEbalance = parseInt(ONEbalance);
          ONEbalance = ONEbalance / ( 10 ** 18 );


		  setWalletAddress(address);
      setONEbalance(ONEbalance);
        } catch (error) {
          console.error('Error loading balance:', error);
        }
      } else {
        console.log('Please install MetaMask to use this application.');
        setIsMetaMaskInstalled(false);
      }
    };

    loadBalance();
  }, [LoadBalanceD]);


  const checkMetaMaskLogin = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        setIsMetaMaskLoggedIn(accounts.length > 0);

        
        window.ethereum.on("accountsChanged", (Newaccounts) => {
          // Handle wallet change
          setIsMetaMaskLoggedIn(Newaccounts.length > 0);
          setLoadBalanceD(LoadBalanceD + 1);
          console.log("cüzdan değişti");
        });


        

        
      } catch (error) {
        console.error("Error checking MetaMask login status:", error);


      }
    }
  };

  checkMetaMaskLogin();





  const loadingOn = async () => {
		setLoading(1);
	}
		
	
	const loadingOff = async () => {
		setLoading(0);
	}





  const takeTokensTopic = async (idx) => {

    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(daoAdres, dao.abi, signer);

    if (ONEbalance < 0.1) {
      Swal.fire({
        text: 'You need to have at least 0.1 ONE in your wallet to continue this operation',
        width: 300,
       
    });

      } else {
          
          const transaction = await contract.GetTokensBack(idx, 0,{
            from: walletAddress,
            gasPrice: 101000000000,
          });
          loadingOn();
          await transaction.wait(); // Wait for the transaction to be confirmed on the blockchain
          loadingOff();
          // Transaction confirmed, execute the success handling code

          setTXH(TXH + 1);
        }


      }






      const takeTokensComment = async (idx, idComment) => {

        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
    
        const contract = new ethers.Contract(daoAdres, dao.abi, signer);
    
        if (ONEbalance < 0.1) {
          Swal.fire({
            text: 'You need to have at least 0.1 ONE in your wallet to continue this operation',
            width: 300,
           
        });
    
          } else {
              
              const transaction = await contract.GetTokensBack(idx, idComment,{
                from: walletAddress,
                gasPrice: 101000000000,
              });
              loadingOn();
              await transaction.wait(); // Wait for the transaction to be confirmed on the blockchain
              loadingOff();
              // Transaction confirmed, execute the success handling code
    
              setTXH(TXH + 1);
            }
    
    
          }








  const addTopic = async () => {

    const title = titleG;
    const content = contenG;
    const tokenMiktari = tokenMiktariG * 1000000;

    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(daoAdres, dao.abi, signer);

    const TokenContract = new ethers.Contract(TokenAddress,Token.abi,signer);

    let hak = await TokenContract.allowance(walletAddress, daoAdres);
    hak = parseInt(hak);

    let tokenMiktariK = await TokenContract.balanceOf(walletAddress);
    tokenMiktariK = parseInt(tokenMiktariK);



    if (ONEbalance < 0.1) {
      Swal.fire({
        text: 'You need to have at least 0.1 ONE in your wallet to continue this operation',
        width: 300,
       
    });
    } else if (tokenMiktariK < tokenMiktari) {
      Swal.fire({
        text: 'You do not have enough LOP tokens in your wallet',
        width: 300,
       
    });
    } else if ( tokenMiktariG < 100000) { 

        Swal.fire({
          text: 'Minimum voting amount is 100000',
          width: 300,
         
      });

      } else if ( tokenMiktariG > 1000000) { 

        Swal.fire({
          text: 'Maximum voting amount is 1000000',
          width: 300,
         
      });

      } else {


        if (hak === 0) {
          const transactionizin = await TokenContract.increaseAllowance(
            daoAdres,
            tokenMiktari,
            {
              from: walletAddress,
              gasPrice: 101000000000,
            }
          );
          loadingOn();
          await transactionizin.wait(); // Wait for the transaction to be confirmed on the blockchain
          loadingOff();

          const transaction = await contract.addTopic(title, content, tokenMiktari,{
            from: walletAddress,
            gasPrice: 101000000000,
          });
          loadingOn();
          await transaction.wait(); // Wait for the transaction to be confirmed on the blockchain
          loadingOff();
          // Transaction confirmed, execute the success handling code

          setTXH(TXH + 1);
        } else if (hak < tokenMiktari) {
          const fark = tokenMiktari - hak;

          const transactionizin = await TokenContract.increaseAllowance(
            daoAdres,
            fark,
            {
              from: walletAddress,
              gasPrice: 101000000000,
            }
          );
          loadingOn();
          await transactionizin.wait(); // Wait for the transaction to be confirmed on the blockchain
          loadingOff();

          const transaction = await contract.addTopic(title, content, tokenMiktari, {
            from: walletAddress,
            gasPrice: 101000000000,
          });
          loadingOn();
          await transaction.wait(); // Wait for the transaction to be confirmed on the blockchain
          loadingOff();
          // Transaction confirmed, execute the success handling code

          setTXH(TXH + 1);
        } else {
          
          const transaction = await contract.addTopic(title, content, tokenMiktari, {
            from: walletAddress,
            gasPrice: 101000000000,
          });
          loadingOn();
          await transaction.wait(); // Wait for the transaction to be confirmed on the blockchain
          loadingOff();
          // Transaction confirmed, execute the success handling code

          setTXH(TXH + 1);
        }


      }

  }





  const addComment = async (idx) => {

    const comment = commentG;
    const tokenMiktaricomment = tokenMiktaricommentG * 1000000;

    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(daoAdres, dao.abi, signer);

    const TokenContract = new ethers.Contract(TokenAddress,Token.abi,signer);

    let hak = await TokenContract.allowance(walletAddress, daoAdres);
    hak = parseInt(hak);

    let tokenMiktariK = await TokenContract.balanceOf(walletAddress);
    tokenMiktariK = parseInt(tokenMiktariK);



    if (ONEbalance < 0.1) {
      Swal.fire({
        text: 'You need to have at least 0.1 ONE in your wallet to continue this operation',
        width: 300,
       
    });
    } else if (tokenMiktariK < tokenMiktaricomment) {
      Swal.fire({
        text: 'You do not have enough LOP tokens in your wallet',
        width: 300,
       
    });
    } else if ( tokenMiktaricommentG < 10000) { 

        Swal.fire({
          text: 'Minimum voting amount is 10000',
          width: 300,
         
      });

      } else if ( tokenMiktaricommentG > 100000) { 

        Swal.fire({
          text: 'Maximum voting amount is 100000',
          width: 300,
         
      });

      } else {


        if (hak === 0) {
          const transactionizin = await TokenContract.increaseAllowance(
            daoAdres,
            tokenMiktaricomment,
            {
              from: walletAddress,
              gasPrice: 101000000000,
            }
          );
          loadingOn();
          await transactionizin.wait(); // Wait for the transaction to be confirmed on the blockchain
          loadingOff();

          const transaction = await contract.addComment(idx, comment, tokenMiktaricomment,{
            from: walletAddress,
            gasPrice: 101000000000,
          });
          loadingOn();
          await transaction.wait(); // Wait for the transaction to be confirmed on the blockchain
          loadingOff();
          // Transaction confirmed, execute the success handling code

          setTXH(TXH + 1);
        } else if (hak < tokenMiktaricomment) {
          const fark = tokenMiktaricomment - hak;

          const transactionizin = await TokenContract.increaseAllowance(
            daoAdres,
            fark,
            {
              from: walletAddress,
              gasPrice: 101000000000,
            }
          );
          loadingOn();
          await transactionizin.wait(); // Wait for the transaction to be confirmed on the blockchain
          loadingOff();

          const transaction = await contract.addComment(idx, comment, tokenMiktaricomment, {
            from: walletAddress,
            gasPrice: 101000000000,
          });
          loadingOn();
          await transaction.wait(); // Wait for the transaction to be confirmed on the blockchain
          loadingOff();
          // Transaction confirmed, execute the success handling code

          setTXH(TXH + 1);
        } else {
          
          const transaction = await contract.addComment(idx, comment, tokenMiktaricomment, {
            from: walletAddress,
            gasPrice: 101000000000,
          });
          loadingOn();
          await transaction.wait(); // Wait for the transaction to be confirmed on the blockchain
          loadingOff();
          // Transaction confirmed, execute the success handling code

          setTXH(TXH + 1);
        }


      }

  }





  const listPassives = async () => {


    try {

         const HMY_RPC_URL = ChainRPC;
         const web3 = new Web3(HMY_RPC_URL)
         const contract = new web3.eth.Contract(dao.abi, daoAdres)

      
         let projectCount = await contract.methods.TopicCount().call();
         projectCount = parseInt(projectCount);

         const ProjectNo3 = [];

         loadingOn();
         for (let i = 1; i <= projectCount; i++) {

          const project_tmp = await contract.methods.Topics(i).call();
          
          const statusX = parseInt(project_tmp.status);

          const commentSayisi = parseInt(project_tmp.commentNo);

          let commentTokeni = 0;

          for (let k = 1; k <= commentSayisi; k++) {

            const commentTokeni_tmp = await contract.methods.comments(i, k).call();
            const commentTokeni_tmpX = parseInt(commentTokeni_tmp.tokeni) / 1000000;
            commentTokeni = commentTokeni + commentTokeni_tmpX;

          }

          const tokeniZf = parseInt(project_tmp.tokeni) / 1000000;

          const tokeniZ = tokeniZf + commentTokeni;

          const tokeniXshowZ = tokeniZ.toLocaleString('en-US', {
            style: 'decimal',
            maximumFractionDigits: 2,
          });

          if ( statusX === 2 ) {
            ProjectNo3.push({
              id: i,
              titleX: project_tmp.title,
              tokeniX: tokeniZ,
              tokeniXshow: tokeniXshowZ
            });

          }

         }
         loadingOff();


    ProjectNo3.sort((a, b) => {
      if (a.tokeniX < b.tokeniX) {
        return 1;
      }
      if (a.tokeniX > b.tokeniX) {
        return -1;
      }
      return 0;
    });

    setProjectNo3(ProjectNo3);

      // Handle the result
      console.log('Smart contract function result:');
  
    } catch (error) {
      console.error('Error calling contract function:', error);
    }


  }








  const listActives = async () => {


    try {

         const HMY_RPC_URL = ChainRPC;
         const web3 = new Web3(HMY_RPC_URL)
         const contract = new web3.eth.Contract(dao.abi, daoAdres)

      
         let projectCount = await contract.methods.TopicCount().call();
         projectCount = parseInt(projectCount);

         const ProjectNo = [];

         loadingOn();
         for (let i = 1; i <= projectCount; i++) {

          const project_tmp = await contract.methods.Topics(i).call();
          
          const statusX = parseInt(project_tmp.status);

          const commentSayisi = parseInt(project_tmp.commentNo);

          let commentTokeni = 0;

          for (let k = 1; k <= commentSayisi; k++) {

            const commentTokeni_tmp = await contract.methods.comments(i, k).call();
            const commentTokeni_tmpX = parseInt(commentTokeni_tmp.tokeni) / 1000000;
            commentTokeni = commentTokeni + commentTokeni_tmpX;

          }

          const tokeniZf = parseInt(project_tmp.tokeni) / 1000000;

          const tokeniZ = tokeniZf + commentTokeni;

          const tokeniXshowZ = tokeniZ.toLocaleString('en-US', {
            style: 'decimal',
            maximumFractionDigits: 2,
          });

          if ( statusX === 1 ) {
            ProjectNo.push({
              id: i,
              titleX: project_tmp.title,
              tokeniX: tokeniZ,
              tokeniXshow: tokeniXshowZ
            });

          }

         }
         loadingOff();


    ProjectNo.sort((a, b) => {
      if (a.tokeniX < b.tokeniX) {
        return 1;
      }
      if (a.tokeniX > b.tokeniX) {
        return -1;
      }
      return 0;
    });

    setProjectNo(ProjectNo);

      // Handle the result
      console.log('Smart contract function result:');
  
    } catch (error) {
      console.error('Error calling contract function:', error);
    }


  }






  const topicOnViewFetch = async (idx) => {


    try {

         const HMY_RPC_URL = ChainRPC;
         const web3 = new Web3(HMY_RPC_URL)
         const contract = new web3.eth.Contract(dao.abi, daoAdres)

         loadingOn();


          const project_tmp = await contract.methods.Topics(idx).call();
          
          const title = project_tmp.title;
          const content = project_tmp.content;

          const commentCount = parseInt(project_tmp.commentNo);

          const kurucu = project_tmp.starter;

          const kurucutokeniX = parseInt(project_tmp.tokeni) / 1000000;

          const kurucutokeniZ = kurucutokeniX.toLocaleString('en-US', {
            style: 'decimal',
            maximumFractionDigits: 2,
          });

          if ( kurucu === walletAddress ) {
            setKurucuTokeni(kurucutokeniZ);
            setKurucuBenim(1);
          }

          const ProjectNo2 = [];


          for (let i = 1; i <= commentCount; i++) {

            const comment_tmp = await contract.methods.comments(idx, i).call();

            const yorumcu = comment_tmp.commenter;

            const yorumcutokeniX = parseInt(comment_tmp.tokeni) / 1000000;

          const yorumcutokeniZ = yorumcutokeniX.toLocaleString('en-US', {
            style: 'decimal',
            maximumFractionDigits: 2,
          });



            let yorumcuBenimX = 0;

            if ( yorumcu === walletAddress ) {
              yorumcuBenimX = 1;
            }

            ProjectNo2.push({
              id: i,
              comment: comment_tmp.content,
              yorumcuBenim: yorumcuBenimX,
              yorumcuTokeni: yorumcutokeniZ
            });



          }




          setProjectNo2(ProjectNo2);






         loadingOff();

    settopicOnViewTitle(title);
    settopicOnViewContent(content);
    settopicOnViewNo(idx)

      // Handle the result
      console.log('Smart contract function result:');
  
    } catch (error) {
      console.error('Error calling contract function:', error);
    }


  }








  const updateTopicTitle = (evt) => {

    settitleG(evt.target.value);

  }

  const updateTopicContent = (evt) => {

    setcontenG(evt.target.value);

  }


  const updateTopicComment = (evt) => {

    setcommentG(evt.target.value);

  }



  const updateTokenMiktari = (evt) => {

    settokenMiktariG(evt.target.value);

  }

  const updateTokenMiktariComment = (evt) => {

    settokenMiktaricommentG(evt.target.value);

  }

  



  return (
    <div className="container">
      <div className="column left">



        <h2>
          <button className='button' onClick={(event) => {
                                                                       event.preventDefault()
                                                                       setnav("Home")
                                                                     }  }>Home
          </button>
        </h2>

        <hr></hr>

        <h2>
          <button className='button' onClick={(event) => {
                                                                       event.preventDefault()
                                                                       if ( navActives === 0 ) {
                                                                       listActives()
                                                                       setnavActives(1)
                                                                      } else {
                                                                        setnavActives(0)
                                                                      }
                                                                     }  }>List Active Topics
          </button>
        </h2>

        {navActives === 1 && (
          <>
            <table className="table">

            <thead>
            <tr>
              <th style={{width: "60%"}}>Topic</th>
              <th style={{width: "40%"}}>Importance</th>
            </tr>
            </thead>



            <tbody>

              {ProjectNo.map((Project) => {
                return (

                    <tr key={Project.id}>
                      <td>
                      
                      <button className='buttonT' onClick={(event) => {
                                                                       event.preventDefault()
                                                                       setnav("Others")
                                                                       topicOnViewFetch(Project.id)
                                                                       
                                                                     }  }>{Project.titleX}
                      </button>
          
          
                      </td>
                      <td>{Project.tokeniXshow}</td>
                    </tr>

                );
              })}
              
            </tbody>



            </table>






          </>
        )}





        <hr></hr>

        <h2>
          <button className='button' onClick={(event) => {
                                                                       event.preventDefault()
                                                                       if ( navPassives === 0 ) {
                                                                        listPassives()
                                                                        setnavPassives(1)
                                                                       } else {
                                                                         setnavPassives(0)
                                                                       }
                                                                     }  }>List Passive Topics
          </button>
        </h2>


        {navPassives === 1 && (
          <>
            <table className="table">

            <thead>
            <tr>
              <th style={{width: "60%"}}>Topic</th>
              <th style={{width: "40%"}}>Importance</th>
            </tr>
            </thead>



            <tbody>

              {ProjectNo3.map((Project) => {
                return (

                    <tr key={Project.id}>
                      <td>
                      
                      <button className='buttonT' onClick={(event) => {
                                                                       event.preventDefault()
                                                                       setnav("OthersPassive")
                                                                       topicOnViewFetch(Project.id)
                                                                       
                                                                     }  }>{Project.titleX}
                      </button>
          
          
                      </td>
                      <td>{Project.tokeniXshow}</td>
                    </tr>

                );
              })}
              
            </tbody>



            </table>






          </>
        )}








      </div>
      <div className="column right">

        {nav === "Home" && (
          <>
          <h2>Kilopi D.A.O Decision Maker dApp</h2>
          <h4>This dApp is a simple/effective idea collector dApp</h4>
          <h4>The purpose is to bring the ideas/feedback together and follow them fully open</h4>
          <h4>By doing so, the community of Kilopi project will be able to understand the concepts better and the decisions of the team will be healthier</h4>

          <h3>Here is the information/rules</h3>
          <h4>There are active and passive topics. New Topics will be active upon creating. There can be maximum of 10 active topic at a time</h4>
          <h4>Topics will move from Active to Passive following a decision or a certain amount of time without any decision</h4>
          <h4>Topics do not have votes. Topics only have comments. Creating a Topic and/or leaving a comment needs LOP tokens</h4>
          <h4>Topics have points according to their LOP tokens reserves. Topic points = Topic Creation LOP tokens + Comments LOP tokens</h4>
          <h4>These points are representing the importance of the topics. The topic which has the maximum points will stay at the top</h4>
          <h4>Creating a Topic requires LOP tokens of minimum: 100.000,00 (100k) and maximum: 1.000.000,00 (1m)</h4>
          <h4>Leaving a Comment requires LOP tokens of minimum: 10.000,00 (10k) and maximum: 100.000,00 (100k)</h4>
          <h4>Topic Creators and/or Commenters have their tokens back 1 month after deploying them</h4>
          <h4>If Topic Creators and/or Commenters have their tokens back, the Topic importance will fall corresponding the loss of the points</h4>
          <h4>If someone tries to troll the system, his tokens will stuck inside of the system. Users are deemed to have accepted this agreement when they use the system </h4>
          <h4>There will be monthly discussions in the videos on youtube following this D.A.O dApp topics</h4>


          {navCreate === 0 ? (

            <h2>
            <button className='button' onClick={(event) => {
                                                                        event.preventDefault()
                                                                        setnavCreate(1)
                                                                      }  }>Create a Topic
            </button>
            </h2>


          ) : (
            <>


          {isMetaMaskInstalled ? (
            <>
            {isMetaMaskLoggedIn ? (
              <>

            <h3>Title</h3>

            <h3>
            <textarea name="TopicTitle" rows="1" placeholder="Topic Title" onChange={updateTopicTitle}/>
            </h3>

            <h3>Content</h3>
            <h3>
            <textarea name="TopicContent" rows="15" placeholder="Topic Content" onChange={updateTopicContent}/>
            </h3>

            <h3>Token Amount</h3>
            <h3>
            <input
              type="number"
              value={tokenMiktariG}
              onChange={updateTokenMiktari}
            />
            </h3>

            <h2>
            <button className='button' onClick={(event) => {
                                                                        event.preventDefault()
                                                                        addTopic()
                                                                      }  }>Ready ! Create the Topic now
            </button>
            </h2>
            <h2>
            <button className='button' onClick={(event) => {
                                                                        event.preventDefault()
                                                                        setnavCreate(0)
                                                                      }  }>Cancel
            </button>
            </h2>

            </>
            ) : (
              <>
              <h3>Metamask is not logged in</h3>
            </>

            )}

            </>
          ) : (
            <>
              <h3>Metamask is not installed</h3>
            </>

          )}




            </>
          )}

          




          


          </>
        )}

          
        {nav === "Others" && (
          <>
          <h2>{topicOnViewTitle}</h2>
          
          <h4>{topicOnViewContent}

          {KurucuBenim === 1 && (

<div>
  {KurucuTokeni}
                <button className='buttonF' onClick={(event) => {
                  event.preventDefault()
                  takeTokensTopic(topicOnViewNo)
                }  }>Take Tokens Back
                </button>
                </div>

          )}

</h4>
<hr></hr>
          <table className="table">

            <thead>
            </thead>



            <tbody>

              {ProjectNo2.map((Project) => {
                return (

                    <tr key={Project.id}>
                      <td>{Project.comment}
                      
                      {Project.yorumcuBenim === 1 && (
                        <div>
                          {Project.yorumcuTokeni}
                        <button className='buttonF' onClick={(event) => {
                          event.preventDefault()
                          takeTokensComment(topicOnViewNo, Project.id)
                        }  }>Take Tokens Back
                        </button>


                        </div>


                      )}
                      
                      <hr></hr>
                      </td>
                    </tr>

                );
              })}
              
            </tbody>



            </table>



          {navAdd === 0 ? (

            <h2>
            <button className='button' onClick={(event) => {
                                                                        event.preventDefault()
                                                                        setnavAdd(1)
                                                                      }  }>Leave a Comment
            </button>
            </h2>


            ) : (
            <>


            {isMetaMaskInstalled ? (
            <>
            {isMetaMaskLoggedIn ? (
              <>

            <h3>Comment</h3>
            <h3>
            <textarea name="TopicComment" rows="15" placeholder="Topic Comment" onChange={updateTopicComment}/>
            </h3>

            <h3>Token Amount</h3>
            <h3>
            <input
              type="number"
              value={tokenMiktaricommentG}
              onChange={updateTokenMiktariComment}
            />
            </h3>

            <h2>
            <button className='button' onClick={(event) => {
                                                                        event.preventDefault()
                                                                        addComment(topicOnViewNo)
                                                                      }  }>Ready ! Publish the Comment
            </button>
            </h2>
            <h2>
            <button className='button' onClick={(event) => {
                                                                        event.preventDefault()
                                                                        setnavAdd(0)
                                                                      }  }>Cancel
            </button>
            </h2>

            </>
            ) : (
              <>
              <h3>Metamask is not logged in</h3>
            </>

            )}

            </>
            ) : (
            <>
              <h3>Metamask is not installed</h3>
            </>

            )}




            </>
            )}



          </>
        )}
        




        {nav === "OthersPassive" && (
          <>
          <h2>{topicOnViewTitle}</h2>
          
          <h4>{topicOnViewContent}

          {KurucuBenim === 1 && (

<div>
{KurucuTokeni}
                <button className='buttonF' onClick={(event) => {
                  event.preventDefault()
                  takeTokensTopic(topicOnViewNo)
                }  }>Take Tokens Back
                </button>
                </div>

          )}

</h4>
          
<hr></hr>


          <table className="table">

            <thead>
            </thead>



            <tbody>

              {ProjectNo2.map((Project) => {
                return (

                    <tr key={Project.id}>
                      <td>{Project.comment}
                      
                      {Project.yorumcuBenim === 1 && (
                        <div>
                          {Project.yorumcuTokeni}
                        <button className='buttonF' onClick={(event) => {
                          event.preventDefault()
                          takeTokensComment(topicOnViewNo, Project.id)
                        }  }>Take Tokens Back
                        </button>
                        
                        </div>


                      )}
                      
                      <hr></hr>
                      
                      </td>
                    </tr>

                );
              })}
              
            </tbody>



            </table>

          </>
        )}







      </div>

      {Loading === 1 && (
        <div className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}



    </div>



  );
};

export default App;
