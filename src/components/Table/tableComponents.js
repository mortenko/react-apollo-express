import React from "react";
import Button from "components/Button";
import { Delete, Edit, FileCopy } from "../../assets/material-ui-icons";

const CopyButtonAction = ({ copyAction }) => (
  <Button onClick={copyAction} variant="fab" color="lightGrey">
    <FileCopy />
  </Button>
);
const DeleteButtonAction = ({ deleteAction }) => (
  <Button onClick={deleteAction} variant="fab" color="secondary">
    <Delete />
  </Button>
);
const UpdateButtonAction = ({ updateAction }) => (
  <Button onClick={updateAction} variant="fab" color="primary">
    <Edit />
  </Button>
);

export { CopyButtonAction, DeleteButtonAction, UpdateButtonAction };
