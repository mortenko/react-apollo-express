import ProductPhoto from "./productPhoto";

const Product = ` 
 type Product {
  productID: ID!
  productname: String!
  description: String!
  pricewithoutdph: Float!
  pricewithdph: Float!
  barcode: UUID!
  createdAt: Date
  ProductPhoto: ProductPhoto
 }
 input ProductInput {
  productID: ID
  productname: String!
  description: String!
  pricewithoutdph: Float!
  pricewithdph: Float!
  barcode: UUID!
 }
 type ProductWithFile {
   product: Product
   photoFile: File
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
   createProduct(photoFile: Upload!, product: ProductInput): ProductWithFile
   updateProduct(productID: ID!, input: ProductInput): Product
   deleteProduct(productID: ID!): Product
 }
`;

export default [Product, ProductPhoto];
