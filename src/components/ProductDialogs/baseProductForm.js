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
  resetForm,
  validationErrors,
  renderBarcode,
  calculatePriceWithdph,
  validationFunctions: { isGreaterThen, isLength, isRequired, isNumber, isUUID }
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
          <Alert>
            {validationErrors.productname}
          </Alert>
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
          <Alert>
            {validationErrors.description}
          </Alert>
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
          <Alert>
            {validationErrors.pricewithoutdph}
          </Alert>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="pricewithdph"
            label="Price with DPH:"
            placeholder="price with dph"
            type="number"
            value={pricewithdph}
            margin="normal"
            helperText="this field is automatically calculated from  price without dph"
            fullWidth
            error={validationErrors.pricewithdph.length !== 0}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AttachMoney />
                </InputAdornment>
              )
              // readOnly: true
            }}
            onChange={event => {
              const { target: { id, value } } = event;
              handleInputChange(event);
              /* both functions isGreaterThen and isNumber update react state using async setState
               * from that reason the function isNumber is called as a anonymous callback
                *
                * */
              isGreaterThen({ pricewithoutdph }, { [id]: value }, () => {
                isNumber(id, value);
              });
            }}
          />
          <Alert>
            {validationErrors.pricewithdph}
          </Alert>
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
          <Alert>
            {validationErrors.barcode}
          </Alert>
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
BaseProductForm.propTypes = {
  calculatePriceWithdph: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  productState: PropTypes.shape({
    product: PropTypes.shape({
      productname: PropTypes.string,
      description: PropTypes.string,
      pricewithoutdph: PropTypes.number,
      pricewithdph: PropTypes.number,
      barcode: PropTypes.string,
      ProductPhoto: PropTypes.shape({
        photo: PropTypes.object,
        name: PropTypes.string
      })
    })
  }),
  renderBarcode: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  validationErrors: PropTypes.object,
  validationFunctions: PropTypes.objectOf(PropTypes.func)
};
BaseProductForm.defaultProps = {
  productState: PropTypes.shape({
    product: PropTypes.shape({
      productname: "",
      description: "",
      pricewithoutdph: 0,
      pricewithdph: 0,
      barcode: "",
      ProductPhoto: PropTypes.shape({
        photo: PropTypes.object,
        name: PropTypes.string
      })
    })
  }),
  validationErrors: {},
  validationFunctions: {}
};

export default BaseProductForm;
