import { compose, withProps } from "recompose";
import withValidator from "../../utils/validation";
import { range } from "lodash";
import withOrderForm from "./withOrderForm";
import { enhanceWithBaseHoc } from "../Dialog/dialogHoc";

const initialErrorValues = {
  firstname: {},
  lastname: {},
  email: {},
  productname_1: []
};

const initialFormValues = {
  order: {
    firstname: "",
    lastname: "",
    email: "",
    incrementProductID: 2,
    products: [
      {
        productID: "productname_1",
        productname: "",
        quantityRange: range(1, 11),
        selectedQuantity: 0,
        pricewithoutdph: 0,
        pricewithdph: 0,
        totalpricewithoutdph: 0,
        totalpricewithdph: 0
      }
    ],
    totalsumwithoutdph: 0,
    totalsumwithdph: 0
  },
  customerFilterResult: [],
  productFilterResult: [],
  advancedFilterBy: {}
};

const enhanceWithOrderHoc = compose(
  withProps(() => ({ initialErrorValues }), withValidator),
  withProps(() => ({ initialFormValues }), withOrderForm),
  enhanceWithBaseHoc,
  withOrderForm
);

export default enhanceWithOrderHoc;
