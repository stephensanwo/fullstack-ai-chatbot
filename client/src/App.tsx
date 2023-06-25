import React, { Fragment } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Chat from "./pages/Chat";
import Error from "./pages/Error";
import Home from "./pages/Home";
import { AppContainer, PageContainer } from "./shared/layout";

function App() {
  return (
    <Fragment>
      <Header
        mainTitle={"stephensanwo.dev"}
        productTitle={"Conversational AI Chatbot"}
      />
      <AppContainer>
        <PageContainer>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/chat/:token_id" element={<Chat />}></Route>
            <Route path="*" element={<Error />} />
          </Routes>
        </PageContainer>
      </AppContainer>
    </Fragment>
  );
}

export default App;
