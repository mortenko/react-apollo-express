import { compose, withProps } from "recompose";
import withValidator from "../../utils/validation";
import { enhanceWithBaseHoc } from "../Dialog/dialogHoc";
import withProductForm from "./withProductForm";

const initialErrorValues = {
  productname: [],
  description: [],
  pricewithoutdph: [],
  // pricewithdph: [],
  barcode: [],
  photo: {}
};
const initialFormValues = {
  product: {
    productname: "",
    description: "",
    pricewithoutdph: 0,
    pricewithdph: 0,
    barcode: "",
    ProductPhoto: {
      photo: null,
      name: ""
    }
  }
};

const withProductHoc = compose(
  withProps(() => ({ initialErrorValues }), withValidator),
  withProps(() => ({ initialFormValues }), withProductForm),
  enhanceWithBaseHoc,
  withProductForm
);

export default withProductHoc;