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
    }
  }
`;

export { CREATE_PRODUCT, FETCH_PRODUCTS, FETCH_PRODUCT, UPDATE_PRODUCT };
