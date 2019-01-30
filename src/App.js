import React from "react";
import { Route } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";
import { compose, fromRenderProps } from "recompose";
import CustomerPage from "containers/CustomerPage";
import HomePage from "containers/HomePage";
import OrderPage from "containers/OrderPage";
import ProductPage from "containers/ProductPage";
import MenuSideBar from "components/MenuSideBar";
import Header from "components/Header";
import Footer from "components/Footer";
import ContentBar from "components/ContentBar";
import RenderPropsModal from "components/ModalProvider/renderPropsModal";
import RenderPropsToastMessage from "components/ToastProvider/renderPropsToastMessage";
import ModalProvider from "components/ModalProvider";
import ToastProvider from "components/ToastProvider";
import withTheme from "@material-ui/core/styles/withTheme";
import { ModalContext, ToastContext } from "./context";
import styles from "./App.scss";
import { toastPropTypes, toastDefaultProps } from "./globalProps";

const enhanceFromRenderPropsHoc = compose(
  fromRenderProps(RenderPropsModal, modal => ({ modal })),
  fromRenderProps(RenderPropsToastMessage, toast => ({ toast })),
  withTheme()
);

const App = ({ modal, toast }) => {
  return (
    <ModalContext.Provider value={modal}>
      <ToastContext.Provider value={toast}>
        <Grid container>
          <Grid item xs={12} sm={12} lg={12}>
            <Header />
          </Grid>
          <Grid item xs={4} sm={2} md={2} lg={1} xl={1}>
            <MenuSideBar />
          </Grid>
          <Grid item xs={8} sm={10} md={10} lg={11} xl={11}>
            <ModalProvider modal={modal} />
            <ContentBar>
              <Route component={HomePage} exact path="/" />
              <Route component={CustomerPage} path="/customers" />
              <Route component={ProductPage} path="/products" />
              <Route component={OrderPage} path="/orders" />
            </ContentBar>
          </Grid>
          <ToastProvider {...toast} />
          <Grid item xs={12} sm={12} lg={12}>
            <Footer />
          </Grid>
        </Grid>
      </ToastContext.Provider>
    </ModalContext.Provider>
  );
};

App.propTypes = {
  modal: PropTypes.shape({
    currentModal: PropTypes.string,
    isOpen: PropTypes.bool,
    data: PropTypes.object,
    openModal: PropTypes.func,
    closeModal: PropTypes.func
  }).isRequired,
  toast: toastPropTypes
};

App.defaultProps = {
  toast: toastDefaultProps
};

export default enhanceFromRenderPropsHoc(App);
