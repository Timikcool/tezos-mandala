import React, { useEffect, useState } from "react";
import { TezosToolkit } from "@taquito/taquito";
import "./App.css";
import ConnectButton from "./components/ConnectWallet";
import DisconnectButton from "./components/DisconnectWallet";
import qrcode from "qrcode-generator";
import UpdateContract from "./components/UpdateContract";
import Transfers from "./components/Transfers";
import Header from "./components/Header";
import { VStack } from "@chakra-ui/layout";
import { Container } from "@chakra-ui/layout";
import { Route, Router, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import MainPage from "./pages/MainPage";
import { useApp } from "./state/app";
import { ExplorePage } from "./pages/ExplorePage";
import { MyCollectionPage } from "./pages/MyCollectionPage";

const history = createBrowserHistory({});

const App = () => {


  const { reconnectWallet } = useApp()
  useEffect(() => {
    reconnectWallet()
  }, [])
  return (

    <Container maxW="container.lg">
      <VStack spacing={16}>
        <Router history={history}>
          <Header />
          <Switch>
            <Route exact path='/' component={MainPage} />
            <Route exact path='/explore' component={ExplorePage} />
            <Route exact path='/my-collection' component={MyCollectionPage} />
          </Switch>
        </Router>
      </VStack>
    </Container>
  )

  // if (publicToken && (!userAddress || isNaN(userBalance))) {
  //   return (
  //     <div className="main-box">
  //       <h1>Taquito Boilerplate</h1>
  //       <div id="dialog">
  //         <header>Try the Taquito Boilerplate App!</header>
  //         <div id="content">
  //           <p className="text-align-center">
  //             <i className="fas fa-broadcast-tower"></i>&nbsp; Connecting to
  //             your wallet
  //           </p>
  //           <div
  //             dangerouslySetInnerHTML={generateQrCode()}
  //             className="text-align-center"
  //           ></div>
  //           <p id="public-token">
  //             {copiedPublicToken ? (
  //               <span id="public-token-copy__copied">
  //                 <i className="far fa-thumbs-up"></i>
  //               </span>
  //             ) : (
  //               <span
  //                 id="public-token-copy"
  //                 onClick={() => {
  //                   if (publicToken) {
  //                     navigator.clipboard.writeText(publicToken);
  //                     setCopiedPublicToken(true);
  //                     setTimeout(() => setCopiedPublicToken(false), 2000);
  //                   }
  //                 }}
  //               >
  //                 <i className="far fa-copy"></i>
  //               </span>
  //             )}

  //             <span>
  //               Public token: <span>{publicToken}</span>
  //             </span>
  //           </p>
  //           <p className="text-align-center">
  //             Status: {beaconConnection ? "Connected" : "Disconnected"}
  //           </p>
  //         </div>
  //       </div>
  //       <div id="footer">
  //         <img src="built-with-taquito.png" alt="Built with Taquito" />
  //       </div>
  //     </div>
  //   );
  // } else if (userAddress && !isNaN(userBalance)) {
  //   return (
  //     <div className="main-box">
  //       <h1>Taquito Boilerplate</h1>
  //       <div id="tabs">
  //         <div
  //           id="transfer"
  //           className={activeTab === "transfer" ? "active" : ""}
  //           onClick={() => setActiveTab("transfer")}
  //         >
  //           Make a transfer
  //         </div>
  //         <div
  //           id="contract"
  //           className={activeTab === "contract" ? "active" : ""}
  //           onClick={() => setActiveTab("contract")}
  //         >
  //           Interact with a contract
  //         </div>
  //       </div>
  //       <div id="dialog">
  //         <div id="content">
  //           {activeTab === "transfer" ? (
  //             <div id="transfers">
  //               <h3 className="text-align-center">Make a transfer</h3>
  //               <Transfers
  //                 Tezos={Tezos}
  //                 setUserBalance={setUserBalance}
  //                 userAddress={userAddress}
  //               />
  //             </div>
  //           ) : (
  //             <div id="increment-decrement">
  //               <h3 className="text-align-center">
  //                 Current counter: <span>{storage}</span>
  //               </h3>
  //               <UpdateContract
  //                 contract={contract}
  //                 setUserBalance={setUserBalance}
  //                 Tezos={Tezos}
  //                 userAddress={userAddress}
  //                 setStorage={setStorage}
  //               />
  //             </div>
  //           )}
  //           <p>
  //             <i className="far fa-file-code"></i>&nbsp;
  //             <a
  //               href={`https://better-call.dev/edo2net/KT1C1ESWEedUGdSPvWsaKJQNhkUJUHuXBVQU/operations`}
  //               target="_blank"
  //               rel="noopener noreferrer"
  //             >
  //               {contractAddress}
  //             </a>
  //           </p>
  //           <p>
  //             <i className="far fa-address-card"></i>&nbsp; {userAddress}
  //           </p>
  //           <p>
  //             <i className="fas fa-piggy-bank"></i>&nbsp;
  //             {(userBalance / 1000000).toLocaleString("en-US")} ꜩ
  //           </p>
  //         </div>
  //         <DisconnectButton
  //           wallet={wallet}
  //           setPublicToken={setPublicToken}
  //           setUserAddress={setUserAddress}
  //           setUserBalance={setUserBalance}
  //           setWallet={setWallet}
  //           setTezos={setTezos}
  //           setBeaconConnection={setBeaconConnection}
  //         />
  //       </div>
  //       <div id="footer">
  //         <img src="built-with-taquito.png" alt="Built with Taquito" />
  //       </div>
  //     </div>
  //   );
  // } else if (!publicToken && !userAddress && !userBalance) {
  //   return (
  //     <div className="main-box">
  //       <div className="title">
  //         <h1>Taquito Boilerplate</h1>
  //         <a href="https://app.netlify.com/start/deploy?repository=https://github.com/ecadlabs/taquito-boilerplate">
  //           <img
  //             src="https://www.netlify.com/img/deploy/button.svg"
  //             alt="netlify-button"
  //           />
  //         </a>
  //       </div>
  //       <div id="dialog">
  //         <header>Welcome to Taquito Boilerplate App!</header>
  //         <div id="content">
  //           <p>Hello!</p>
  //           <p>
  //             This is a template Tezos dApp built using Taquito. It's a starting
  //             point for you to hack on and build your own dApp for Tezos.
  //             <br />
  //             If you have not done so already, go to the{" "}
  //             <a
  //               href="https://github.com/ecadlabs/taquito-boilerplate"
  //               target="_blank"
  //               rel="noopener noreferrer"
  //             >
  //               Taquito boilerplate Github page
  //             </a>{" "}
  //             and click the <em>"Use this template"</em> button.
  //           </p>
  //           <p>Go forth and Tezos!</p>
  //         </div>
  //         <ConnectButton
  //           Tezos={Tezos}
  //           setContract={setContract}
  //           setPublicToken={setPublicToken}
  //           setWallet={setWallet}
  //           setUserAddress={setUserAddress}
  //           setUserBalance={setUserBalance}
  //           setStorage={setStorage}
  //           contractAddress={contractAddress}
  //           setBeaconConnection={setBeaconConnection}
  //         />
  //       </div>
  //       <div id="footer">
  //         <img src="built-with-taquito.png" alt="Built with Taquito" />
  //       </div>
  //     </div>
  //   );
  // } else {
  //   return <div>An error has occurred</div>;
  // }
};

export default App;
