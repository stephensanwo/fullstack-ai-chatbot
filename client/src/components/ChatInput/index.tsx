/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect, useRef } from "react";
import SessionContext, { MessageProps } from "../../context/session";
import { ChatMessage, ChatInputContainer, SendMessage } from "./style";
import { v4 as uuid4 } from "uuid";

interface ChatInputProps {
  chat: MessageProps;
  setChat: React.Dispatch<React.SetStateAction<MessageProps>>;
}

const ChatInput: React.FC<ChatInputProps> = (props) => {
  const [chatInput, setChatInput] = useState("");
  const { messages, setMessages, token, setSocketState } =
    useContext(SessionContext);
  const [isPaused, setPause] = useState(false);
  const handleChange = (event: any) => {
    setChatInput(event.target.value);
  };

  const ws = useRef<any>();

  useEffect(() => {
    if (null !== ws) {
      ws.current = new WebSocket(`ws://127.0.0.1:3500/chat?token=${token}`);
      ws.current.onopen = () => setSocketState("active");
      ws.current.onclose = () => setSocketState("");

      const wsCurrent = ws.current;

      return () => {
        wsCurrent.close();
      };
    }
  }, []);

  useEffect(() => {
    if (!ws.current) return;

    ws.current.onmessage = (event: any) => {
      if (isPaused) return;
      const message = JSON.parse(event.data);
      setMessages(messages.concat(message));
      console.log(messages);
    };
  }, [isPaused]);

  const updateMessages = async (event: any) => {
    event.preventDefault();
    setPause(!isPaused);
    if (chatInput.length > 0) {
      const chat: MessageProps = {
        id: uuid4(),
        msg: `Human: ${chatInput}`,
        timestamp: Date.now().toLocaleString(),
      };
      setMessages(messages.concat(chat));
      ws.current.send(chatInput);
      setChatInput("");
    }
  };

  return (
    <ChatInputContainer onSubmit={updateMessages}>
      <ChatMessage
        placeholder="Send a Message"
        value={chatInput}
        type="text"
        onChange={handleChange}
      />
      <SendMessage>Send</SendMessage>
    </ChatInputContainer>
  );
};

export default ChatInput;
