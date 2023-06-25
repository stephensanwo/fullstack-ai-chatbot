import React from "react";
import "./style.css";
import { LoaderInterface } from "./types";

const Loader: React.FC<LoaderInterface> = ({ size, ...rest }) => {
  return (
    <div
      className="loader"
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    ></div>
  );
};

export default Loader;
