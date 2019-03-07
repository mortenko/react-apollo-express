import React, { Fragment } from "react";
import AutoComplete from "components/Autocomplete";
import PropTypes from "prop-types";
import { Grid, TextField, Fab } from "@material-ui/core";
import { RemoveCircle, AddCircle } from "../../assets/material-ui-icons";
import { orderProductPropTypes } from "./propTypes";

export const AddProductIcon = ({ productSize, addProduct }) => (
  <Grid item>
    <Fab color="primary" disabled={productSize == 9} onClick={addProduct}>
      <AddCircle />
    </Fab>
  </Grid>
);

AddProductIcon.propTypes = {
  addProduct: PropTypes.func.isRequired,
  productSize: PropTypes.number.isRequired
};

export const RemoveProductIcon = ({ removeProduct, productID }) => (
  <Grid item>
    <Fab onClick={() => removeProduct(productID)} color="secondary">
      <RemoveCircle />
    </Fab>
  </Grid>
);

RemoveProductIcon.propTypes = {
  productID: PropTypes.string.isRequired,
  removeProduct: PropTypes.func.isRequired
};

const RenderProduct = props => {
  const {
    debounceInputChange,
    handleDynamicInputChange,
    handleDynamicSelectChange,
    productFilterResult,
    product: { productID, selectedQuantity, quantityRange, ...product }
  } = props;
  const productValue = product["productname"];
  return (
    <Fragment>
      <Grid item xs={7}>
        <AutoComplete
          debounceInputChange={debounceInputChange}
          filterBy={productID}
          filterResult={productFilterResult}
          handleInputChange={handleDynamicInputChange}
          handleSelectChange={handleDynamicSelectChange}
          label={`Search for product ${productID}`}
          value={productValue}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          fullWidth
          id="selectedQuantity"
          label="Select Quantity:"
          value={selectedQuantity}
          select
          SelectProps={{
            readOnly: productValue === ""
          }}
          helperText={
            productValue === "" && (
              <span style={{ color: "red" }}>
                Please select product before quantity
              </span>
            )
          }
          onChange={({ target: { value } }) =>
            handleDynamicSelectChange(productID, value)
          }
        >
          {quantityRange.map(value => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </TextField>
      </Grid>
    </Fragment>
  );
};

RenderProduct.defaultProps = {
  productFilterResult: []
};

RenderProduct.propTypes = {
  debounceInputChange: PropTypes.func.isRequired,
  handleDynamicInputChange: PropTypes.func.isRequired,
  handleDynamicSelectChange: PropTypes.func.isRequired,
  product: orderProductPropTypes.isRequired,
  productFilterResult: PropTypes.array
};

export default RenderProduct;
