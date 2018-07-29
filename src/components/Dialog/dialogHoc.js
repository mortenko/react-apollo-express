import { compose } from "recompose";
import { DialogStyles } from "./index";
import { withRouter } from "react-router";
import withValidator from "../../utils/validation";
import withStyles from "@material-ui/core/styles/withStyles";

//TODO THIS SHOULD BE MOVE TO ANOTHER PLACE
export const enhanceWithBaseHoc = compose(
  withStyles(DialogStyles),
  withValidator,
  withRouter
);
