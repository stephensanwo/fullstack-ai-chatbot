import React from "react";
import Loader from "../Loader";
import "./style.css";
import { ButtonInterface } from "./types";
import SVG from "../../assets/arrow_right.svg";

const Button: React.FC<ButtonInterface> = ({ kind, text, icon, ...props }) => {
  return (
    <button className={`button button-${kind}`} {...props}>
      <h6>{text}</h6>
      {!props.isLoading ? (
        <img src={SVG} width="16px" height={"16px"} alt="arrow ne" />
      ) : (
        <Loader size={16} />
      )}
    </button>
  );
};

export default Button;
