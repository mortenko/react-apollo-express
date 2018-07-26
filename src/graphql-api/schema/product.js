import ProductPhoto from "./productPhoto";

const Product = ` 
 type Product {
  productID: ID!
  name: String!
  description: String!
  pricewithoutdph: Float!
  pricewithdph: Float!
  barcode: UUID!
  createdAt: Date
  ProductPhoto: ProductPhoto
 }
 input ProductInput {
  name: String!
  description: String!
  pricewithoutdph: Float!
  pricewithdph: Float!
  barcode: UUID!
  photo: String!
 }
  type Products implements Pagination {
   products: [Product] 
   count: Int!
   cursor: Int!
  }
 extend type Query {
  products(cursor: Int!, pageNumber: Int!): Products
  product(productID: ID!): Product
 }
 extend type Mutation {
   createProduct(input: ProductInput): Product
   updateProduct(productID: ID!, input: ProductInput): Product
   deleteProduct(productID: ID!): Product
 }
`;

export default [Product, ProductPhoto];
