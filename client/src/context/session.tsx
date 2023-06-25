import { createContext, useState } from "react";

interface SessionProviderProps {
  children: React.ReactNode;
}

export interface MessageProps {
  id: string;
  msg: string;
  timestamp: string;
}

interface SessionContextProps {
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  messages: Array<MessageProps>;
  setMessages:
    | React.Dispatch<React.SetStateAction<Array<MessageProps>>>
    | React.Dispatch<React.SetStateAction<MessageProps>>
    | any;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  session_start: string;
  setSessionStart: React.Dispatch<React.SetStateAction<string>>;
  socketState: string;
  setSocketState: React.Dispatch<React.SetStateAction<string>>;
}

const SessionContext = createContext({} as SessionContextProps);

export const SessionProvider = ({ children }: SessionProviderProps) => {
  const [token, setToken] = useState("");
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState("");
  const [session_start, setSessionStart] = useState("");
  const [socketState, setSocketState] = useState("");

  return (
    <SessionContext.Provider
      value={{
        token,
        setToken,
        messages,
        setMessages,
        name,
        setName,
        session_start,
        setSessionStart,
        socketState,
        setSocketState,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export default SessionContext;
