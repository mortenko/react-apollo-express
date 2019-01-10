import { compose, withProps } from "recompose";
import withTheme from "@material-ui/core/styles/withTheme";
import withValidator from "../../utils/validation";
import withCustomerForm from "./withCustomerForm";
import { enhanceWithBaseHoc } from "../Dialog/dialogHoc";

const initialErrorValues = {
  firstname: [],
  lastname: [],
  email: [],
  phone: [],
  photo: {}
};
const initialFormValues = {
  customer: {
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    CustomerPhoto: {
      photo: null,
      name: ""
    }
  }
};

const enhanceWithCustomerHoc = compose(
  withProps(() => ({ initialErrorValues }), withValidator),
  withProps(() => ({ initialFormValues }), withCustomerForm),
  withTheme(),
  enhanceWithBaseHoc,
  withCustomerForm
);
export default enhanceWithCustomerHoc;