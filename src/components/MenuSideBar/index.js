import React from "react";
import { Link } from "react-router-dom";
import styles from "./menu.scss";

export default function MenuSideBar() {
  return (
    <div className={styles.menu}>
      <ul>
        <li>
          <Link to="/customers"> Customer </Link>
        </li>
        <li>
          <Link to="/products"> Products </Link>
        </li>
        <li>
          <Link to="/orders">Orders </Link>
        </li>
      </ul>
    </div>
  );
}
