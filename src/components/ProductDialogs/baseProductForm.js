import React from "react";
import PropTypes from "prop-types";
import { DialogContent, InputAdornment, TextField } from "components/Dialog";
import Alert from "components/Alert";
import Grid from "@material-ui/core/Grid";
import UploadButton from "components/Button/uploadButton";
import styles from "./baseProductForm.scss";
import { productDefaultProps, productPropTypes } from "./propTypes";
import {
  Note,
  Description,
  AttachMoney,
  EnhancedEncryption
} from "../../assets/material-ui-icons";
import Button from "components/Button";

const BaseProductForm = ({
  disabled,
  productState: {
    product: {
      productname,
      description,
      pricewithoutdph,
      pricewithdph,
      barcode,
      ProductPhoto: { photo, name }
    }
  },
  handleInputChange,
  renderBarcode,
  printErrorMessage,
  validationFunctions: { isLength, isRequired, isNumber, isUUID },
  validationState: { validationErrors }
}) => {
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
            error={Object.keys(validationErrors.productname).length > 0}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Note />
                </InputAdornment>
              )
            }}
            onChange={({ target: { id, value } }) => {
              handleInputChange(id, value);
              isLength(5, 25)(id, value);
              isRequired({ [id]: value });
            }}
          />
          <Alert>{printErrorMessage(validationErrors.productname)}</Alert>
        </Grid>
        <Grid className={disabled && styles.dialog__disable} item xs={12}>
          <TextField
            id="description"
            label="Description:"
            placeholder="description"
            multiline
            rowsMax={5}
            margin="normal"
            value={description}
            fullWidth
            error={Object.keys(validationErrors.description).length > 0}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Description />
                </InputAdornment>
              )
            }}
            onChange={({ target: { id, value } }) => {
              handleInputChange(id, value);
              isLength(20, 150)(id, value);
              isRequired({ [id]: value });
            }}
          />
          <Alert>{printErrorMessage(validationErrors.description)}</Alert>
        </Grid>
        <Grid className={disabled && styles.dialog__disable} item xs={12}>
          <TextField
            id="pricewithoutdph"
            label="Price without DPH:"
            placeholder="price without dph"
            value={pricewithoutdph}
            margin="normal"
            fullWidth
            error={Object.keys(validationErrors.pricewithoutdph).length > 0}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AttachMoney />
                </InputAdornment>
              )
            }}
            onChange={({ target: { id, value } }) => {
              handleInputChange(id, value);
              isNumber(id, value);
              isRequired({ [id]: value });
            }}
          />
          <Alert>{printErrorMessage(validationErrors.pricewithoutdph)}</Alert>
        </Grid>
        <Grid className={disabled && styles.dialog__disable} item xs={12}>
          <TextField
            id="pricewithdph"
            label="Price with DPH:"
            placeholder="price with dph"
            value={pricewithdph}
            margin="normal"
            helperText="this field is automatically calculated from  price without dph"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AttachMoney />
                </InputAdornment>
              ),
              readOnly: true
            }}
          />
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
              error={Object.keys(validationErrors.barcode).length > 0}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EnhancedEncryption />
                  </InputAdornment>
                )
              }}
              onChange={({ target: { id, value } }) => {
                handleInputChange(id, value);
                isUUID(id, value);
                isRequired({ [id]: value });
              }}
            />
            <div className={styles.barcode__button}>
              <Button warning onClick={renderBarcode}>
                Generate UUID
              </Button>
            </div>
          </div>
          <Alert>{printErrorMessage(validationErrors.barcode)}</Alert>
        </Grid>
        <Grid className={disabled && styles.dialog__disable} item xs={12}>
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

BaseProductForm.propTypes = {
  disabled: PropTypes.bool,
  handleInputChange: PropTypes.func.isRequired,
  printErrorMessage: PropTypes.func.isRequired,
  productState: PropTypes.shape({
    product: productPropTypes
  }),
  renderBarcode: PropTypes.func.isRequired,
  validationFunctions: PropTypes.objectOf(PropTypes.func),
  validationState: PropTypes.shape({
    validationErrors: PropTypes.object
  })
};

BaseProductForm.defaultProps = {
  disabled: false,
  productState: PropTypes.shape({
    product: productDefaultProps
  }),
  validationState: {},
  validationFunctions: {}
};

export default BaseProductForm;
