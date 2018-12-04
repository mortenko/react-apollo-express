import React, { Fragment } from "react";
import Button from "components/Button";
import PropTypes from "prop-types";
import styles from "./table.scss";
import { Delete, Edit, FileCopy } from "../../assets/material-ui-icons";

const CopyButtonAction = ({ copyAction }) => (
  <Button onClick={copyAction} variant="fab" color="lightGrey">
    <FileCopy />
  </Button>
);
CopyButtonAction.propTypes = {
  copyAction: PropTypes.func.isRequired
};

const CreateButtonAction = ({ createAction, title, children }) => (
  <Fragment>
    <div className={styles.table__title}>{title}</div>
    <div>
      <Button onClick={createAction} color="success" variant="fab">
        {children}
      </Button>
    </div>
  </Fragment>
);
CreateButtonAction.propTypes = {
  createAction: PropTypes.func,
  title: PropTypes.string,
  children: PropTypes.node
}.isRequired;

const DeleteButtonAction = ({ deleteAction }) => (
  <Button onClick={deleteAction} variant="fab" color="secondary">
    <Delete />
  </Button>
);

DeleteButtonAction.propTypes = {
  deleteAction: PropTypes.func.isRequired
};
const UpdateButtonAction = ({ updateAction }) => (
  <Button onClick={updateAction} variant="fab" color="primary">
    <Edit />
  </Button>
);

UpdateButtonAction.propTypes = {
  updateAction: PropTypes.func.isRequired
};

export {
  CreateButtonAction,
  CopyButtonAction,
  DeleteButtonAction,
  UpdateButtonAction,
};
