import styled from "styled-components";
import { ThemeColors } from "./themes";

export const AppContainer = styled.div`
  min-height: 100vh;
  max-width: 100vw;
  padding-right: 5%;
  padding-left: 5%;
  background-color: ${(props: any) =>
    props.dark ? ThemeColors.bgDark : ThemeColors.bgLight};
  /* @media (max-width: 1080px) {
    display: none;
  } */
`;

export const PageContainer = styled.div`
  padding-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: 1080px) {
    max-width: 600px;
    margin: auto;
  }
`;

export const Margin = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
`;

export const MarginSmall = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
`;

export const Heading1 = styled.h1`
  font-weight: 500;
  font-size: 42px;
  line-height: 1.4;
  color: #000;
  letter-spacing: 0.5px;
  font-family: "IBM Plex Sans", sans-serif;
  /* color: #039874; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: auto;
  text-align: center;
  padding: 0px;
  margin: 0px;
`;

export const Heading4 = styled.h4`
  letter-spacing: normal;
  font-family: "IBM Plex Sans", sans-serif;
  font-weight: 500;
  font-size: 28px;
  color: #000000;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: auto;
  text-align: center;
  padding: 0 0;
  margin: 0 0;
  line-height: 1.4;
`;

export const Paragraph = styled.p`
  font-weight: 400;
  font-size: 14px;
  letter-spacing: normal;
  font-family: "IBM Plex Sans", sans-serif;
  font-weight: 400;
  color: ${(props: any) => (props.light ? "#ffffff" : "#000000")};
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: auto;
  text-align: left;
  padding: 0 0;
  margin: 0 0;
  line-height: 1.4;
`;

export const Small = styled.p`
  font-weight: 400;
  font-size: 10px;
  letter-spacing: normal;
  font-family: "IBM Plex Sans", sans-serif;
  font-weight: 400;
  color: ${(props: any) => (props.light ? "#ffffff" : "#333333")};
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: auto;
  text-align: center;
  padding: 0 0;
  margin: 0 0;
  line-height: 1.2;
`;

export const ErrorIndicator = styled(Small)`
  color: #f01c5c;
  margin-top: 20px;
`;
