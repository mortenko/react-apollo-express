import ProductPhoto from "./productPhoto";

const Product = ` 
 type Product {
  productID: ID!
  name: String!
  description: String!
  pricewithoutdph: Float!
  pricewithdph: Float!
  barcode: Int!
  ProductPhoto: ProductPhoto
 }
 input ProductInput {
  name: String!
  description: String!
  pricewithoutdph: Float!
  pricewithdph: Float!
  barcode: Int!
  photo: String!
 }
 extend type Query {
  products: [Product]
  product(productID: ID!): Product
 }
 extend type Mutation {
   createProduct(input: ProductInput): Product
   updateProduct(productID: ID!, input: ProductInput): Product
   deleteProduct(productID: ID!): Product
 }
`;

export default [Product, ProductPhoto];
