import styled from "styled-components";

export const Input = styled.input`
  all: unset;
  height: 50px;
  width: 310px;
  background-color: #f4f4f4;
  border: 1px solid #e8e8e8;
  margin-top: 15px;
  font-weight: 400;
  font-size: 16px;
  font-family: "IBM Plex Sans", sans-serif;
  padding-left: 10px;

  ::placeholder {
    font-weight: 400;
    font-size: 16px;
    font-family: "IBM Plex Sans", sans-serif;
    text-align: left;
  }
`;

export const Button = styled.button`
  all: unset;
  cursor: pointer;
  height: 50px;
  width: 320px;
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 2px;
  font-weight: 400;
  font-size: 14px;
  text-align: center;
  font-family: "IBM Plex Sans", sans-serif;
  text-align: left;
  color: #fff;

  :hover {
    background-color: rgba(0, 0, 0, 0.788);
    color: #fff;
  }
`;

export const Loader = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
