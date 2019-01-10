import React, { Fragment } from "react";
import Fab from "components/Button/fab";
import PropTypes from "prop-types";
import styles from "./table.scss";
import { Delete, Edit, FileCopy } from "../../assets/material-ui-icons";

const CreateButtonAction = ({ createAction, title, children }) => (
  <Fragment>
    <div className={styles.table__title}>{title}</div>
    <div>
      <Fab color="primary" onClick={createAction} variant="round">
        {children}
      </Fab>
    </div>
  </Fragment>
);

CreateButtonAction.propTypes = {
  children: PropTypes.node.isRequired,
  createAction: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
};

const UpdateButtonAction = ({ updateAction }) => (
  <Fab variant="round" color="secondary" onClick={updateAction}>
    <Edit />
  </Fab>
);

UpdateButtonAction.propTypes = {
  updateAction: PropTypes.func.isRequired
};

const DeleteButtonAction = ({ deleteAction }) => {
  return (
    <Fab danger variant="round" onClick={deleteAction}>
      <Delete />
    </Fab>
  );
};

DeleteButtonAction.propTypes = {
  deleteAction: PropTypes.func.isRequired
};

const CopyButtonAction = ({ copyAction }) => (
  <Fab variant="round" color="inherit" onClick={copyAction}>
    <FileCopy />
  </Fab>
);

CopyButtonAction.propTypes = {
  copyAction: PropTypes.func.isRequired
};

export {
  CreateButtonAction,
  CopyButtonAction,
  DeleteButtonAction,
  UpdateButtonAction
};
