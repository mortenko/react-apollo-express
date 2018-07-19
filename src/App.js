import React from "react";
import { Route } from "react-router-dom";
import { adopt } from "react-adopt";
import Grid from "@material-ui/core/Grid";
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
import { ModalContext, ToastContext } from "./context";
import styles from "App.scss";

//TODO rewrite to fromRenderProps when it will be release
const AppRenderPropsComponent = adopt({
  modal: <RenderPropsModal />,
  toast: <RenderPropsToastMessage />,
});

const App = () => {
  return (
    <AppRenderPropsComponent>
      {({ modal, toast }) => {
        return (
          <ModalContext.Provider value={modal}>
            <ToastContext.Provider value={toast}>
                <Grid container>
                  <Grid item xs={12} sm={12} lg={12}>
                    <Header />
                  </Grid>
                  <Grid item xs={3} sm={3} md={2} lg={1}  xl={1}>
                    <MenuSideBar />
                  </Grid>
                  <Grid item xs={9} sm={9} md={10} lg={11} xl={11}>
                    <ModalProvider modal={modal} />
                    <ContentBar>
                      <Route exact path="/" component={HomePage} />
                      <Route path="/customers" component={CustomerPage} />
                      <Route path="/products" component={ProductPage} />
                      <Route path="/orders" component={OrderPage} />
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
      }}
    </AppRenderPropsComponent>
  );
};
export default App;
