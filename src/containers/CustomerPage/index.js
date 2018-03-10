import React, { Component } from "react";
import styles from "./customer.scss";
import { gql } from "graphql-tag";

export default class CustomerPage extends Component {
  constructor() {
    super();
  }
  render() {
    return <div className={styles.colorCustomer}>Customer</div>;
  }
}
