import React, { Component } from "react";
import PropTypes from "prop-types";
import { has, isEmpty, debounce, range, uniqBy } from "lodash";
import { FILTER_CUSTOMER } from "../../graphql-client/queries/customer";
import { FILTER_PRODUCT } from "../../graphql-client/queries/product";
import { orderPropTypes, orderDefaultProps } from "./propTypes";

export default function withOrderForm(WrappedComponent) {
  return class extends Component {
    static propTypes = {
      formData: orderPropTypes,
      initialFormValues: orderPropTypes,
      resetErrorValues: PropTypes.func.isRequired,
      validationFunctions: PropTypes.objectOf(PropTypes.func)
    };

    static defaultProps = {
      initialFormValues: {
        order: orderDefaultProps,
        advancedFilterBy: {},
        customerFilterResult: [],
        productFilterResult: []
      },
      formData: undefined,
      validationFunctions: {}
    };

    constructor(props) {
      super(props);
      const setInitialFormValues = props.formData
        ? { ...props.formData }
        : { ...props.initialFormValues };
      this.state = {
        ...setInitialFormValues
      };
    }

    handleSelectChange = (filterBy, value) => {
      this.setState(prevState => {
        return {
          order: {
            ...prevState.order,
            [filterBy]: value
          },
          advancedFilterBy: {
            ...prevState.advancedFilterBy,
            [filterBy]: value
          }
        };
      });
      this.props.validationFunctions.isRequired({ [filterBy]: value });
    };

    resetAdvancedFilter = (id, value) => {
      const { advancedFilterBy } = this.state;
      if (
        (has(advancedFilterBy, id) && isEmpty(value)) ||
        Object.keys(advancedFilterBy).length <= 1
      ) {
        const { [id]: value, ...restFilter } = advancedFilterBy;
        this.setState({
          advancedFilterBy: restFilter
        });
      }
    };

    // reset advancedFilter method when f.e. 2/3 inputs are empty and only last one is non-empty
    handleInputChange = ({ target: { id, value } }) => {
      this.setState(currentState => {
        return {
          order: {
            ...currentState.order,
            [id]: value
          }
        };
      });
      this.props.validationFunctions.isRequired({ [id]: value });
      this.resetAdvancedFilter(id, value);
    };
    // add next product and set its initial values
    addProduct = () => {
      const {
        order: { incrementProductID },
        order
      } = this.state;
      this.setState({
        order: {
          ...order,
          incrementProductID: incrementProductID + 1,
          products: order.products.concat([
            {
              productID: `productname_${incrementProductID}`,
              productname: "",
              selectedQuantity: 0,
              quantityRange: range(1, 11),
              pricewithoutdph: 0,
              pricewithdph: 0,
              totalpricewithoutdph: 0,
              totalpricewithdph: 0
            }
          ])
        }
      });
    };

    removeProduct = productID => {
      const {
        order: { products }
      } = this.state;

      const updatedProductsArray = products.filter(product => {
        if (productID !== product.productID) return product;
      });
      // when product is removed recalculate totalsum with/without dph
      const { totalsumwithoutdph, totalsumwithdph } = this.calculateTotalSum(
        updatedProductsArray
      );
      this.setState({
        order: {
          ...this.state.order,
          products: updatedProductsArray,
          totalsumwithoutdph,
          totalsumwithdph
        }
      });
    };

    handleDynamicInputChange = ({ target: { id, value } }) => {
      const {
        order,
        order: { products }
      } = this.state;
      const updateProduct = products.map(product => {
        return product.productID === id
          ? { ...product, productname: value }
          : product;
      });
      this.setState({
        order: {
          ...order,
          products: updateProduct
        }
      });
    };
    // update quantity of product
    updateProductQuantity = (productIdnf, value) => {
      return this.state.order.products.map(product => {
        const {
          pricewithdph,
          pricewithoutdph,
          productID,
          selectedQuantity
        } = product;
        let { totalpricewithdph, totalpricewithoutdph } = product;
        // if quantity of product doesnt change do nothing with price of product
        if (selectedQuantity !== value) {
          totalpricewithoutdph = pricewithoutdph * value;
          totalpricewithdph = pricewithdph * value;
        }
        return productIdnf === productID
          ? {
              ...product,
              selectedQuantity: value,
              totalpricewithoutdph,
              totalpricewithdph
            }
          : product;
      });
    };
    // extract product names (this is needed to pass result to validation func isRequired)
    extractProductName = products => {
      return products.reduce((acc, product) => {
        acc[product.productID] = product.productname;
        return acc;
      }, {});
    };

    resetForm = () => {
      this.props.resetErrorValues();
      this.setState({
        ...this.props.initialFormValues
      });
    };

    calculateTotalSum = product => {
      return product.reduce(
        (acc, { totalpricewithoutdph, totalpricewithdph }) => {
          acc["totalsumwithoutdph"] += totalpricewithoutdph;
          acc["totalsumwithdph"] += totalpricewithdph;
          return acc;
        },
        {
          totalsumwithoutdph: 0,
          totalsumwithdph: 0
        }
      );
    };
    // update name of the product
    changeProduct = (productIdnf, value) => {
      //find prices for selected product
      const [
        { pricewithoutdph, pricewithdph }
      ] = this.state.productFilterResult.filter(product => {
        if (product.value === value) return product;
      });
      this.props.validationFunctions.isRequired({ [productIdnf]: value });
      /* update selected product and add its price 
        if you choose the same product again function uniqBy remove the duplicity
      */
      return uniqBy(
        this.state.order.products.map(product => {
          const { selectedQuantity } = product;
          const setDefaultQuantity =
            selectedQuantity == 0 ? 1 : selectedQuantity;
          if (Object.values(product).includes(value)) {
            return {
              ...product,
              selectedQuantity: setDefaultQuantity + 1
            };
          } else if (Object.values(product).includes(productIdnf)) {
            return {
              ...product,
              productname: value,
              selectedQuantity: setDefaultQuantity,
              pricewithoutdph,
              pricewithdph,
              totalpricewithoutdph: pricewithoutdph * setDefaultQuantity,
              totalpricewithdph: pricewithdph * setDefaultQuantity
            };
          } else {
            return product;
          }
        }),
        "productname"
      );
    };

    formatOrderResponse = order => {
      return (
        <div>
          <h1 style="text-align:center;">New Order created!</h1>
          {order.map(
            (
              {
                productID,
                productname,
                quantity,
                totalsumwithoutdph,
                totalsumwithdph
              },
              index
            ) => (
              <div key={productID}>
                <strong>Product: {productname} </strong> with totalQuantity:
                <strong>{quantity} </strong>
                {order.length - 1 === index && (
                  <p>
                    <strong>totalsumwithoutdph: </strong> {totalsumwithoutdph}$
                    <br />
                    <strong> totalsumwithdph: </strong> {totalsumwithdph}$
                  </p>
                )}
              </div>
            )
          )}
        </div>
      );
    };

    handleDynamicSelectChange = (productIdnf, value) => {
      let updateProduct = [];
      if (typeof value === "number") {
        updateProduct = this.updateProductQuantity(productIdnf, value);
      } else if (typeof value === "string") {
        updateProduct = this.changeProduct(productIdnf, value);
      }
      // recalculate total sum when product is changed. This func is triggered also when product doesn't change
      const { totalsumwithoutdph, totalsumwithdph } = this.calculateTotalSum(
        updateProduct
      );
      // check if number is float and format its price with two fixed point notation
      const roundSumWithoutDph =
        totalsumwithoutdph % 1 === 0
          ? totalsumwithoutdph
          : Number(Number(totalsumwithoutdph).toFixed(2)); // toFixed() return string ..its needs to be cast on Number
      const roundSumWitDph =
        totalsumwithdph % 1 === 0
          ? totalsumwithdph
          : Number(Number(totalsumwithdph).toFixed(2));

      this.setState({
        order: {
          ...this.state.order,
          products: updateProduct,
          totalsumwithoutdph: roundSumWithoutDph,
          totalsumwithdph: roundSumWitDph
        }
      });
    };

    customerFilterChange = debounce(async (client, id, value) => {
      const { advancedFilterBy } = this.state;
      try {
        const {
          data: { filter }
        } = await client.query({
          query: FILTER_CUSTOMER,
          variables: { filterBy: { [id]: value }, advancedFilterBy }
        });
        this.setState({
          customerFilterResult: filter
        });
      } catch (customerFilterError) {
        this.props.validationFunctions.handleServerErrors(customerFilterError);
      }
    }, 200);

    productFilterChange = debounce(async (client, id, value) => {
      try {
        const {
          data: { filter }
        } = await client.query({
          query: FILTER_PRODUCT,
          variables: { filterBy: value }
        });
        this.setState({
          productFilterResult: filter
        });
      } catch (productFilterError) {
        this.props.validationFunctions.handleServerErrors(productFilterError);
      }
    });

    render() {
      const stateProps = {
        newData: this.state
      };
      const funcProps = {
        addProduct: () => this.addProduct(),
        customerFilterChange: (client, id, value) =>
          this.customerFilterChange(client, id, value),
        formatOrderResponse: order => this.formatOrderResponse(order),
        handleInputChange: event => this.handleInputChange(event),
        handleDynamicInputChange: event => this.handleDynamicInputChange(event),
        handleDynamicSelectChange: (nextProductID, value) =>
          this.handleDynamicSelectChange(nextProductID, value),
        handleSelectChange: (filterBy, value) =>
          this.handleSelectChange(filterBy, value),
        extractProductName: products => this.extractProductName(products),
        productFilterChange: (client, id, value) =>
          this.productFilterChange(client, id, value),
        resetForm: () => this.resetForm(),
        removeProduct: nextProductID => this.removeProduct(nextProductID)
      };
      return (
        <WrappedComponent {...this.props} {...funcProps} {...stateProps} />
      );
    }
  };
}
