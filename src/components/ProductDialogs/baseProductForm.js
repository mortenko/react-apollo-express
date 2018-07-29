import React from "react";
import PropTypes from "prop-types";
import { DialogContent, InputAdornment, TextField } from "components/Dialog";
import Alert from "components/Alert";
import Grid from "@material-ui/core/Grid";
import UploadButton from "components/Button/uploadButton";
import styles from "./baseProductForm.scss";
import {
  Note,
  Description,
  AttachMoney,
  EnhancedEncryption
} from "../../assets/material-ui-icons";
import Button from "components/Button";

const BaseProductForm = ({
  productState,
  classes,
  handleInputChange,
  resetForm,
  validationErrors,
  renderBarcode,
  validationFunctions: { isLength, isRequired, isNumber, isUUID }
}) => {
  //TODO AUTOMATICALY COUNT pricewithdph filed acc price without dph
  const {
    product: {
      productname,
      description,
      pricewithoutdph,
      pricewithdph,
      barcode,
      ProductPhoto: { photo, name }
    }
  } = productState;
  return (
    <Grid container>
      <DialogContent>
        <Grid item xs={12}>
          <TextField
            id="productname"
            label="Product Name:"
            placeholder="product name"
            margin="normal"
            value={productname}
            fullWidth
            error={validationErrors.productname.length !== 0}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Note />
                </InputAdornment>
              )
            }}
            onChange={event => {
              handleInputChange(event);
              isLength(5, 20)(event.target.id, event.target.value);
            }}
          />
          <Alert>{validationErrors.productname}</Alert>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="description"
            label="Description:"
            placeholder="description"
            multiline
            rowsMax={5}
            margin="normal"
            value={description}
            fullWidth
            error={validationErrors.description.length !== 0}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Description />
                </InputAdornment>
              )
            }}
            onChange={event => {
              handleInputChange(event);
              isLength(20, 150)(event.target.id, event.target.value);
            }}
          />
          <Alert>{validationErrors.description}</Alert>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="pricewithoutdph"
            label="Price without DPH:"
            placeholder="price without dph"
            value={pricewithoutdph}
            type="number"
            margin="normal"
            fullWidth
            error={validationErrors.pricewithoutdph.length !== 0}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AttachMoney />
                </InputAdornment>
              )
            }}
            onChange={event => {
              handleInputChange(event);
              isNumber(event.target.id, event.target.value);
            }}
          />
          <Alert>{validationErrors.pricewithoutdph}</Alert>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="pricewithdph"
            label="Price with DPH:"
            placeholder="price with dph"
            type="number"
            value={pricewithdph}
            margin="normal"
            fullWidth
            error={validationErrors.pricewithdph.length !== 0}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AttachMoney />
                </InputAdornment>
              )
            }}
            onChange={event => {
              handleInputChange(event);
              isNumber(event.target.id, event.target.value);
            }}
          />
          <Alert>{validationErrors.pricewithdph}</Alert>
        </Grid>
        <Grid item xs={12}>
          <div className={styles.barcode}>
            <TextField
              id="barcode"
              label="Barcode:"
              placeholder="Barcode"
              value={barcode}
              fullWidth
              margin="normal"
              error={validationErrors.barcode.length !== 0}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EnhancedEncryption />
                  </InputAdornment>
                )
              }}
              onChange={event => {
                handleInputChange(event);
                isUUID(event.target.id, event.target.value);
              }}
            />
            <div className={styles.barcode__button}>
              <Button onClick={renderBarcode}>Generate UUID</Button>
            </div>
          </div>
          <Alert>{validationErrors.barcode}</Alert>
        </Grid>
        <Grid item xs={12}>
          <UploadButton
            handleInputChange={handleInputChange}
            photo={photo}
            validate={{ isRequired }}
            validationPhotoError={validationErrors.photo}
            photoName={name}
          />
        </Grid>
      </DialogContent>
    </Grid>
  );
};

export default BaseProductForm;
