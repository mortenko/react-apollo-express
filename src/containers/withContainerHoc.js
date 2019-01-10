import { compose, fromRenderProps } from "recompose";
import { ModalContext } from "../context";
import { PaginationHoc } from "components/Pagination";
import { withTheme } from "@material-ui/core/styles";

const { Consumer: ModalConsumer } = ModalContext;

export const enhanceWithContainerHoc = compose(
  PaginationHoc,
  fromRenderProps(ModalConsumer, value => value),
  withTheme()
);
