import React from "react";
import { Link } from "react-router-dom";
import styles from "./menusidebar.scss";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import withStyles from "@material-ui/core/styles/withStyles";
import classnames from "classnames";

const activeStyles = {
  MenuItem: {
    color: "#17a2b8",
    "&:focus": {
      color: "#000",
      backgroundColor: "#007bff",
      textDecoration: "underline"
    }
  },
  MuiList: {
    padding: 0
  }
};
const MenuSideBar = ({ classes }) => (
  <MenuList className={classnames(styles.menuSidebar, classes.MuiList)}>
    <Link to="/customers">
      <MenuItem className={classes.MenuItem}>Customers</MenuItem>
    </Link>
    <Link to="/products">
      <MenuItem className={classes.MenuItem}>Products</MenuItem>
    </Link>
    <Link to="/orders">
      <MenuItem className={classes.MenuItem}>Orders</MenuItem>
    </Link>
  </MenuList>
);

export default withStyles(activeStyles)(MenuSideBar);
