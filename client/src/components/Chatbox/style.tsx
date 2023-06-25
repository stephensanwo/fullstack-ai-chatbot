import styled from "styled-components";

export const ChatboxContainer = styled.div`
  width: 100%;
  min-height: 500px;
  max-height: 500px;
  padding: 10px;

  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  overscroll-behavior-y: contain;
  scroll-snap-type: y proximity;
  border: 1px solid #e8e8e8;
`;
export const SessionStateIndicator = styled.div`
  height: 2px;
  width: 100%;
  background-color: ${(props: { state: string }) =>
    props.state === "active" ? "#42be65" : "#fa4d56"}; ;
`;

export const Messagebox = styled.div`
  min-width: 40%;
  max-width: 40%;
  min-height: 50px;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  display: table;
`;

export const BotMessage = styled(Messagebox)`
  background-color: #393939;
  align-self: flex-start;
`;

export const HumanMessage = styled(Messagebox)`
  background-color: #0f62fe;
  align-self: flex-end;
`;

export const ChatTimeIndicator = styled.p`
  font-weight: 400;
  font-size: 10px;
  letter-spacing: normal;
  font-family: "IBM Plex Sans", sans-serif;
  font-weight: 400;
  color: ${(props: any) => (props.light ? "#ffffff" : "#333333")};
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: auto;
  text-align: left;
  padding: 0 0;
  margin: 0 0;
  line-height: 1.2;
  margin-top: 10px;
`;
