import React, { Fragment, useState, useContext } from "react";
import {
  ErrorIndicator,
  Heading1,
  Margin,
  MarginSmall,
  Paragraph,
  Small,
} from "../shared/layout";
import { Input, Loader } from "../shared/utilities";
import { useNavigate } from "react-router-dom";
import { axios } from "../middleware/axios";
import SessionContext from "../context/session";
import loader from "../assets/loader.svg";
import Button from "../components/Button";
import InlineNotification from "../components/InlineNotification";

const Home = () => {
  const { setToken, name, setName, setSessionStart } =
    useContext(SessionContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  console.log(name);

  const handleInput = (event: any) => {
    setName(event.target.value);
  };

  const CREATE_SESSION = async () => {
    try {
      setLoading(true);
      const token = await axios.post(`/token?name=${name}`);
      setToken(token?.data.token);
      setName(token?.data.name);
      setSessionStart(token?.data.session_start);
      setLoading(false);
      navigate(`chat/${token.data.token}`);
    } catch (error: any) {
      setLoading(false);
      if (error?.message === "timeout exceeded") {
        setError("An unknown error has occured, Please try again later");
      } else if (error?.response.status === 400) {
        setError("Error! Provide Required Credentials");
      } else {
        setError("An unknown error has occured, Please try again later");
      }
    }
  };

  const onSubmit = (event: any) => {
    event.preventDefault();
    if (name.length > 0) {
      CREATE_SESSION();
    } else {
      setError("Error! Provide Required Credentials");
    }
  };

  return (
    <Fragment>
      <Heading1>Conversational AI Chatbot</Heading1>
      <MarginSmall />
      <Paragraph style={{ textAlign: "center" }}>
        A conversational Artificial Intelligence based chatbot built with
        Python, Redis, React, FastAPI and GPT-J-6B language model on Huggingface
      </Paragraph>
      <InlineNotification
        kind={"error"}
        children={
          "Warning: It is hard to predict how the AI will respond to particular prompts and offensive content may occur without warning"
        }
      />
      <InlineNotification
        kind={"warning"}
        children={
          "APPLICATION MAY BE UNSTABLE - This application is a development build for testing purposes only. It is not intended for production use, nor does it guarantee accuracy of the result."
        }
      />

      {loading ? (
        <Loader>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "137px",
            }}
          >
            <Paragraph> Loading Session</Paragraph>
            <img src={loader} alt="UI loading" />
          </div>
        </Loader>
      ) : (
        <form onSubmit={onSubmit}>
          <Input
            placeholder="Enter your name to start chat"
            value={name}
            type="text"
            onChange={handleInput}
          ></Input>
          <MarginSmall></MarginSmall>

          <Margin />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "left",
            }}
          >
            <Button kind="secondary" text={"Start Chat"} hasIcon={true} />
            {error ? <ErrorIndicator>{error}</ErrorIndicator> : ""}
          </div>
        </form>
      )}
      <Margin></Margin>
    </Fragment>
  );
};

export default Home;
