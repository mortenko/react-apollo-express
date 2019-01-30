import React, { Fragment } from "react";
import AutoComplete from "components/Autocomplete";
import PropTypes from "prop-types";
import { Grid, TextField, Fab } from "@material-ui/core";
import { RemoveCircle, AddCircle } from "../../assets/material-ui-icons";
import { orderProductPropTypes } from "./propTypes";

const RenderProduct = props => {
  const {
    addProduct,
    debounceInputChange,
    handleDynamicInputChange,
    handleDynamicSelectChange,
    productsLength,
    productFilterResult,
    removeProduct,
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
                Please select product before quantity{" "}
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
      <Grid item>
        {productID === "productname_1" ? (
          <Fab
            color="primary"
            disabled={productsLength === 9}
            onClick={addProduct}
          >
            <AddCircle />
          </Fab>
        ) : (
          <Fab onClick={() => removeProduct(productID)} color="secondary">
            <RemoveCircle />
          </Fab>
        )}
      </Grid>
    </Fragment>
  );
};

RenderProduct.propTypes = {
  addProduct: PropTypes.func.isRequired,
  debounceInputChange: PropTypes.func.isRequired,
  handleDynamicInputChange: PropTypes.func.isRequired,
  handleDynamicSelectChange: PropTypes.func.isRequired,
  product: orderProductPropTypes.isRequired,
  productFilterResult: PropTypes.array.isRequired,
  productsLength: PropTypes.number.isRequired,
  removeProduct: PropTypes.func.isRequired
};

export default RenderProduct;
