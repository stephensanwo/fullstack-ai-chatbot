import React from "react";
import "./style.css";
import { InlineNotificationInterface } from "./types";

const InlineNotification: React.FC<InlineNotificationInterface> = (props) => {
  return (
    <div className={`notification notification-${props.kind}`} {...props}>
      {props.children}
    </div>
  );
};

export default InlineNotification;
