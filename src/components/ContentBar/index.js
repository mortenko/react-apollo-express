import React from "react";
import styles from "./content.scss";

export default function ContentBar(props) {
    return(<div className={styles.content}>{props.children}</div>)

}