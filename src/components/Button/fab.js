import React from "react";
import PropTypes from "prop-types";
import { Fab as MaterialFab } from "@material-ui/core";
import withTheme from "@material-ui/core/styles/withTheme";

const Fab = ({
  children,
  color,
  variant,
  onClick,
  style,
  theme: { palette },
  ...props
}) => {
  let btnBackground = {};
  if (props.danger) btnBackground = palette.danger;
  if (props.info) btnBackground = palette.info;
  if (props.warning) btnBackground = palette.warning;
  return (
    <MaterialFab
      style={{ ...btnBackground }}
      color={color}
      variant={variant}
      onClick={onClick}
    >
      {children}
    </MaterialFab>
  );
};

Fab.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
  danger: PropTypes.bool,
  info: PropTypes.bool,
  onClick: PropTypes.func,
  style: PropTypes.object,
  theme: PropTypes.shape({ palette: PropTypes.object }).isRequired,
  variant: PropTypes.string,
  warning: PropTypes.bool
};

Fab.defaultProps = {
  children: PropTypes.element,
  color: "default",
  danger: false,
  info: false,
  onClick: () => {},
  style: {},
  variant: "round",
  warning: false
};

export default withTheme()(Fab);
