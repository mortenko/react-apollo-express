import React, { Component } from "react";
import PropTypes from "prop-types";
import { has, isEmpty, debounce, range } from "lodash";
import { FILTER_CUSTOMER } from "../../graphql-client/queries/customer";
import { FILTER_PRODUCT } from "../../graphql-client/queries/product";

export default function withOrderForm(WrappedComponent) {
  return class extends Component {
    static propTypes = {
      formData: PropTypes.shape({}),
      initialFormValues: PropTypes.shape({}),
      resetErrorValues: PropTypes.func.isRequired,
      validationFunctions: PropTypes.objectOf(PropTypes.func)
    };

    static defaultProps = {
      initialFormValues: {
        order: {
          firstname: "",
          lastname: "",
          email: "",
          incrementProductID: 2,
          products: [
            {
              productID: 1,
              productname: "",
              quantity: "",
              selectedQuantity: 0,
              totalsumwithoutdph: 0,
              totalsumwithdph: 0
            }
          ]
        },
        advancedFilterBy: {},
        customerFilterResult: []
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
              productID: incrementProductID,
              [`productname_${incrementProductID}`]: "",
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
        const productName = `productname_${product.productID}`;
        return productName === id
          ? { ...product, [productName]: value }
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
        acc[`productname_${product.productID}`] =
          product[`productname_${product.productID}`];
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
      // update selected product and add its price
      return this.state.order.products.map(product => {
        const { selectedQuantity } = product;
        const setDefaultQuantity = selectedQuantity == 0 ? 1 : selectedQuantity;

        return Object.keys(product).includes(productIdnf)
          ? {
              ...product,
              [productIdnf]: value,
              selectedQuantity: setDefaultQuantity,
              pricewithoutdph,
              pricewithdph,
              totalpricewithoutdph: pricewithoutdph * setDefaultQuantity,
              totalpricewithdph: pricewithdph * setDefaultQuantity
            }
          : product;
      });
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
      this.setState({
        order: {
          ...this.state.order,
          products: updateProduct,
          totalsumwithoutdph,
          totalsumwithdph
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
      } catch (ApolloError) {
        //TODO handling error this will be fix in another commit same for productFilterChange
        console.log("ApolloError", ApolloError);
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
      } catch (ApolloError) {
        console.log("ApolloError", ApolloError);
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
