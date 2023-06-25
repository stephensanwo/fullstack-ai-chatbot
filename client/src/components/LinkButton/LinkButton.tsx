import React from "react";
import "./style.css";
import { LinkButtonInterface } from "./types";
import SVG from "../../assets/arrow_ne.svg";

const LinkButton: React.FC<LinkButtonInterface> = ({
  kind,
  href,
  text,
  hasIcon,
  icon,
  ...rest
}) => {
  return (
    <a
      className={`link-button link-button-${kind}`}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <h6>{text}</h6>
      <img src={SVG} width="16px" height={"16px"} alt="arrow ne" />
    </a>
  );
};

export default LinkButton;
