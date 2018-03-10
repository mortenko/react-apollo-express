import React, { Component } from "react";
import MenuSideBar from "./components/MenuSideBar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Content from "./components/ContentBar";
import HomePage from "./containers/HomePage";
import CustomerPage from "./containers/CustomerPage";
import ProductPage from "./containers/ProductPage";
import OrderPage from "./containers/OrderPage";
import { Route } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <MenuSideBar />
        <Content>
          <Route exact path="/" component={HomePage} />
          <Route path="/customers" component={CustomerPage} />
          <Route path="/products" component={ProductPage} />
          <Route path="/orders" component={OrderPage} />
        </Content>
        <Footer />
      </div>
    );
  }
}

export default App;
