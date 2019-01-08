import { compose, fromRenderProps } from "recompose";
import { ModalContext } from "../context";
import { PaginationHoc } from "components/Pagination";

const { Consumer: ModalConsumer } = ModalContext;

export const enhanceWithContainerHoc = compose(
  PaginationHoc,
  fromRenderProps(ModalConsumer, value => value)
);
