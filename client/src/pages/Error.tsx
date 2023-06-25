import React, { Fragment } from "react";
import { Heading1, Margin } from "../shared/layout";
import { Button } from "../shared/utilities";
import { useNavigate } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();
  const navHome = () => {
    navigate("/");
  };
  return (
    <Fragment>
      <Heading1>
        404 Error <br /> Page Not Found
      </Heading1>
      <Margin />
      <Button onClick={navHome}>Go Home</Button>
    </Fragment>
  );
};

export default Error;
