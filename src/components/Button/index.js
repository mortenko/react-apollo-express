import React from "react";
import PropTypes from "prop-types";
import { Button as MaterialButton } from "@material-ui/core";

const buttonPallete = {
  success: "#d4edda",
  info: "#d1ecf1",
  primary: "#cce5ff",
  danger: "#FF0000",
  lightGrey: "#e2e3e5",
  materialBlue: "#2196f3"
};

const Button = ({
  children,
  color,
  variant,
  onClick,
  ...props
}) => {
  const buttonStyles = {
    background: buttonPallete[color],
  };
  return (
    <MaterialButton
      color={color}
      style={buttonStyles}
      variant={variant}
      onClick={onClick}
      {...props}
    >
      {children}
    </MaterialButton>
  );
};
Button.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.string,
  onClick: PropTypes.func,
  variant: PropTypes.string
};
Button.defaultProps = {
  onClick: () => {},
  color: "primary",
  variant: "contained"
};

export default Button;
