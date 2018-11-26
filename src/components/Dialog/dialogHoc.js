import React from "react";
import { compose, fromRenderProps } from "recompose";
import { DialogStyles } from "./index";
import { withRouter } from "react-router";
import withValidator from "../../utils/validation";
import { ToastContext } from "../../context/index";
import withStyles from "@material-ui/core/styles/withStyles";
export const { Consumer: ToastConsumer } = ToastContext;

export const enhanceWithBaseHoc = compose(
  withStyles(DialogStyles),
  withValidator,
  withRouter,
  fromRenderProps(ToastConsumer, (toast) => ({ toast })),
);
