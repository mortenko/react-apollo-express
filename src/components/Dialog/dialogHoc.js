import { compose, fromRenderProps } from "recompose";
import { withRouter } from "react-router";
import withStyles from "@material-ui/core/styles/withStyles";
import { DialogStyles } from "./index";
import withValidator from "../../utils/validation";
import { ToastContext } from "../../context/index";

export const { Consumer: ToastConsumer } = ToastContext;

export const enhanceWithBaseHoc = compose(
  fromRenderProps(ToastConsumer, (toast) => ({ toast })),
  withStyles(DialogStyles),
  withValidator,
  withRouter,
);
