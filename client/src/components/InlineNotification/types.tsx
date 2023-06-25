import React from "react";
export interface InlineNotificationInterface
  extends React.ButtonHTMLAttributes<HTMLDivElement> {
  kind: "warning" | "error" | "neutral" | "success";
  children: React.ReactNode | string;
}
