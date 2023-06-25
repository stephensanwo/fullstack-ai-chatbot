export interface LinkButtonInterface {
  kind: "primary" | "secondary" | "tertiary" | "danger";
  href?: string;
  text: string;
  hasIcon: boolean;
  icon?: React.ReactNode;
}
