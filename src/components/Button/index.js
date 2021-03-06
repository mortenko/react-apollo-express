import React from "react";
import PropTypes from "prop-types";
import { Button as MaterialButton } from "@material-ui/core";
import { withTheme } from "@material-ui/core/styles";

const Button = ({
  children,
  color,
  style,
  variant,
  onClick,
  theme: { palette },
  ...props
}) => {
  const { danger, info, warning, ...rest } = props;
  let btnBackground = {};
  if (danger) btnBackground = palette.danger;
  if (info) btnBackground = palette.info;
  if (warning) btnBackground = palette.warning;
  return (
    <MaterialButton
      color={color}
      style={{ ...btnBackground }}
      variant={variant}
      onClick={onClick}
      {...rest}
    >
      {children}
    </MaterialButton>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.string,
  danger: PropTypes.bool,
  info: PropTypes.bool,
  onClick: PropTypes.func,
  style: PropTypes.object,
  theme: PropTypes.shape({ palette: PropTypes.object }).isRequired,
  variant: PropTypes.string,
  warning: PropTypes.bool
};

Button.defaultProps = {
  color: "default",
  danger: false,
  info: false,
  onClick: () => {},
  style: {},
  variant: "contained",
  warning: false
};

export default withTheme()(Button);
