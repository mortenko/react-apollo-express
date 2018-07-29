import { compose } from "recompose";
import { DialogStyles } from "./index";
import { withRouter } from "react-router";
import withValidator from "../../utils/validation";
import withStyles from "@material-ui/core/styles/withStyles";

export const enhanceWithBaseHoc = compose(
  withStyles(DialogStyles),
  withValidator,
  withRouter
);
