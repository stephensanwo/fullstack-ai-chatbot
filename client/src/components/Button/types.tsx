import React from "react";
export interface ButtonInterface
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  kind: "primary" | "secondary" | "tertiary" | "danger";
  text: string;
  hasIcon: boolean;
  icon?: React.ReactNode;
  isLoading?: boolean;
}
