import React, { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import { VStack } from "@chakra-ui/layout";
import { Container } from "@chakra-ui/layout";
import { Redirect, Route, Router, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import MainPage from "./pages/MainPage";
// import { useApp } from "./state/app";
import { ExplorePage } from "./pages/ExplorePage";
import { MyCollectionPage } from "./pages/MyCollectionPage";
import { Footer } from "./components/Footer";
import SendMandalaModal from "./components/SendMandalaModal";
import { MigrationPage } from "./pages/MigrationPage";
import MigratingMandalaModal from "./components/MigratingMandalaModal";

const history = createBrowserHistory({});

const App = () => {


  return (
    <>
      <Container maxW="container.lg" minH="100vh">
        <VStack spacing={16} maxW="100%">
          <Router history={history}>
            <Header />
            <Switch>
              {/* <Route exact path='/' component={MainPage} />
              <Route exact path='/explore' component={ExplorePage} />
              <Route exact path='/my-collection' component={MyCollectionPage} /> */}
              <Route exact path='/migration' component={MigrationPage} />
              <Redirect from="/*" to='/migration' />
            </Switch>

          </Router>
        </VStack>
      </Container>
      <Footer />
      <SendMandalaModal />
      <MigratingMandalaModal />
    </>
  )
};

export default App;
