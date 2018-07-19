const DialogStyles = {
  muiDialogActions: {
    display: "flex",
    justifyContent: "space-around",
    position: "absolute",
    width: 300,
    right: 30,
    bottom: 10
  },
  uploadInput: {
    display: "none"
  },
  iconLeft: {
    paddingRight: 5,
    fontSize: 20
  },
  MuiDialogContentText: {
    paddingTop: "5%"
  }
};
export { default as Dialog } from "@material-ui/core/Dialog";
export { default as DialogTitle } from "@material-ui/core/DialogTitle";
export { default as DialogContent } from "@material-ui/core/DialogContent";
export {
  default as DialogContentText
} from "@material-ui/core/DialogContentText";
export { default as DialogActions } from "@material-ui/core/DialogActions";
export { default as InputAdornment } from "@material-ui/core/InputAdornment";
export { default as TextField } from "@material-ui/core/TextField";
export { DialogStyles };
