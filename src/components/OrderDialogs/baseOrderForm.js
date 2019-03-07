import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import AutoComplete from "components/Autocomplete";
import Alert from "components/Alert";
import styles from "./baseOrderForm.scss";
import { DialogContent, InputAdornment, TextField } from "components/Dialog";
import RenderProduct, {
  AddProductIcon,
  RemoveProductIcon
} from "./renderProduct";
import { AttachMoney } from "../../assets/material-ui-icons";
import { orderPropTypes, orderDefaultProps } from "./propTypes";

const BaseOrderForm = props => {
  const {
    addProduct,
    customerFilterChange,
    disabled,
    handleInputChange,
    handleSelectChange,
    handleDynamicInputChange,
    handleDynamicSelectChange,
    orderState,
    productFilterChange,
    printErrorMessage,
    removeProduct,
    validationState: { validationErrors }
  } = props;
  const {
    order: {
      firstname,
      lastname,
      email,
      products,
      totalsumwithoutdph,
      totalsumwithdph
    },
    customerFilterResult,
    productFilterResult,
    advancedFilterBy
  } = orderState;
  return (
    <Grid container>
      <DialogContent className={disabled && styles.dialog__disable}>
        <Grid item xs={12}>
          <AutoComplete
            filterBy="firstname"
            value={firstname}
            label="Search for firstname:"
            advancedFilterBy={advancedFilterBy}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            debounceInputChange={customerFilterChange}
            filterResult={customerFilterResult}
          />
          <Alert>{printErrorMessage(validationErrors.firstname)}</Alert>
        </Grid>
        <Grid item xs={12}>
          <AutoComplete
            filterBy="lastname"
            label="Search for lastname"
            value={lastname}
            advancedFilterBy={advancedFilterBy}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            debounceInputChange={customerFilterChange}
            filterResult={customerFilterResult}
          />
          <Alert>{printErrorMessage(validationErrors.lastname)}</Alert>
        </Grid>
        <Grid item xs={12}>
          <AutoComplete
            filterBy="email"
            value={email}
            label="Search for email"
            advancedFilterBy={advancedFilterBy}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            debounceInputChange={customerFilterChange}
            filterResult={customerFilterResult}
          />
          <Alert>{printErrorMessage(validationErrors.email)}</Alert>
        </Grid>
        <Grid container alignItems="center" justify="space-between">
          {products.length > 0 &&
            products.map((product, index, array) => (
              <Fragment key={product.productID}>
                <RenderProduct
                  debounceInputChange={productFilterChange}
                  handleDynamicInputChange={handleDynamicInputChange}
                  handleDynamicSelectChange={handleDynamicSelectChange}
                  productFilterResult={productFilterResult}
                  product={product}
                />
                {index === 0 ? (
                  <AddProductIcon
                    addProduct={addProduct}
                    productSize={array.length}
                  />
                ) : (
                  <RemoveProductIcon
                    removeProduct={removeProduct}
                    productID={product.productID}
                  />
                )}
                <Alert>
                  {printErrorMessage(validationErrors[product.productID])}
                </Alert>
              </Fragment>
            ))}
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="totalsumwithoutdph"
            label="Total price without DPH:"
            placeholder="total price without dph"
            value={totalsumwithoutdph}
            margin="normal"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AttachMoney />
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="totalsumwithdph"
            label="Total price with DPH:"
            placeholder="total price with dph"
            value={totalsumwithdph}
            margin="normal"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AttachMoney />
                </InputAdornment>
              )
            }}
          />
        </Grid>
      </DialogContent>
    </Grid>
  );
};

BaseOrderForm.defaultProps = {
  disabled: false,
  orderState: {
    advancedFilterBy: {},
    customerFilterResult: [],
    order: orderDefaultProps,
    productFilterResult: []
  },
  validationState: {}
};

BaseOrderForm.propTypes = {
  addProduct: PropTypes.func.isRequired,
  customerFilterChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  handleDynamicInputChange: PropTypes.func.isRequired,
  handleDynamicSelectChange: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleSelectChange: PropTypes.func.isRequired,
  orderState: PropTypes.shape({
    order: orderPropTypes,
    customerFilterResult: PropTypes.array,
    productFilterResult: PropTypes.array,
    advancedFilterBy: PropTypes.object
  }),
  printErrorMessage: PropTypes.func.isRequired,
  productFilterChange: PropTypes.func.isRequired,
  removeProduct: PropTypes.func.isRequired,
  validationState: PropTypes.shape({
    validationErrors: PropTypes.object
  })
};

export default BaseOrderForm;
