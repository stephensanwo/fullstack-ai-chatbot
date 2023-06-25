import React, { Fragment, useContext, useEffect, useState } from "react";
import SessionContext, { MessageProps } from "../context/session";
import {
  ErrorIndicator,
  Heading4,
  Margin,
  MarginSmall,
  Paragraph,
  Small,
} from "../shared/layout";
import { Loader } from "../shared/utilities";
import { axios } from "../middleware/axios";
import { useParams } from "react-router-dom";
import moment from "moment";
import Chatbox from "../components/Chatbox";
import loader from "../assets/loader.svg";
import ChatInput from "../components/ChatInput";
import InlineNotification from "../components/InlineNotification";

const Chat = () => {
  const {
    setToken,
    session_start,
    setName,
    name,
    setSessionStart,
    setMessages,
  } = useContext(SessionContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [chat, setChat] = useState<MessageProps>({
    id: "",
    msg: "",
    timestamp: "",
  });
  const { token_id } = useParams();

  useEffect(() => {
    const REFRESH_SESSION = async () => {
      setLoading(true);
      try {
        const token = await axios.get(`/refresh_token?token=${token_id}`);
        setToken(token?.data.token);
        setName(token?.data.name);
        setSessionStart(token?.data.session_start);
        setMessages(token?.data.messages);
        setLoading(false);
      } catch (error: any) {
        setLoading(false);
        setError("An unknown error has occured, Please try again later");
      }
    };

    REFRESH_SESSION();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token_id]);

  return (
    <Fragment>
      {" "}
      {loading ? (
        <Loader>
          <img src={loader} alt="UI loading" />
        </Loader>
      ) : (
        <Fragment>
          <Heading4>Welcome {name}</Heading4>
          <Paragraph>
            Session Start: {moment(session_start, "YYYYMMDD").fromNow()}
          </Paragraph>
          <ErrorIndicator>{error}</ErrorIndicator>
          <MarginSmall></MarginSmall>
          <Chatbox />
          <ChatInput chat={chat} setChat={setChat} />
          <Margin />
        </Fragment>
      )}
      <InlineNotification
        kind={"error"}
        children={
          "Warning: It is hard to predict how the AI will respond to particular prompts and offensive content may occur without warning"
        }
      />
    </Fragment>
  );
};

export default Chat;
