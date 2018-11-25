import { gql } from "apollo-server-express";

const FETCH_PRODUCTS = gql`
  query products($cursor: Int!, $pageNumber: Int!) {
    products(cursor: $cursor, pageNumber: $pageNumber)
      @connection(key: "products", filter: ["pageNumber"]) {
      products {
        productID
        productname
        description
        pricewithoutdph
        pricewithdph
        barcode
        createdAt
        ProductPhoto {
          photo
          name
        }
      }
      count
    }
  }
`;
const FETCH_PRODUCT = gql`
  query product($productID: Int!) {
    product(productID: $productID)
      @connection(key: "product", filter: ["productID"]) {
      productID
      productname
      description
      pricewithoutdph
      pricewithdph
      barcode
      ProductPhoto {
        photo
        name
      }
    }
  }
`;

const CREATE_PRODUCT = gql`
  mutation createProduct($photoFile: Upload!, $product: ProductInput!) {
    createProduct(photoFile: $photoFile, product: $product) {
      product {
        productname
        description
        pricewithoutdph
        pricewithdph
        barcode
      }
      photoFile {
        photoFile
      }
      mutationResponse {
        code
        message
        success
      }
    }
  }
`;

const UPDATE_PRODUCT = gql`
  mutation updateProduct($photoFile: Upload!, $product: ProductInput!) {
    updateProduct(photoFile: $photoFile, product: $product) {
      product {
        productID
        productname
        description
        pricewithoutdph
        pricewithdph
        barcode
        ProductPhoto {
          photo
          name
        }
      }
      photoFile {
        photoFile
      }
      mutationResponse {
        code
        message
        success
      }
    }
  }
`;

const DELETE_PRODUCT = gql`
  mutation deleteProduct($productID: Int!) {
    deleteProduct(productID: $productID) {
      product {
        productID
      }
    }
  }
`;

export {
  FETCH_PRODUCTS,
  FETCH_PRODUCT,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT
};
