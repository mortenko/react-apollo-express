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
 type ProductResponse {
   product: Product
   photoFile: File
   mutationResponse: MutationResponse
 }
 type Products implements IPagination {
  products: [Product] 
  count: Int!
  cursor: Int!
 }
 extend type Query {
  products(cursor: Int!, pageNumber: Int!): Products
  product(productID: Int!): Product
 }
 extend type Mutation {
   createProduct(photoFile: Upload!, product: ProductInput): ProductResponse
   updateProduct(photoFile: Upload!, product: ProductInput): ProductResponse
   deleteProduct(productID: Int!): ProductResponse
 }
`;

export default [Product, ProductPhoto];
