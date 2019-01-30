const OrderItem = `
 type OrderItem {
  orderItemID: ID!
  quantity: Int
  totalsumwithdph: Float
  totalsumwithoutdph: Float
  createdAt: Date
  updatedAt: Date
  product: Product
  customer: Customer
 }

 type Orders implements IPagination {
  orders: [OrderItem] 
  count: Int!
  cursor: Int! 
}

 input OrderProduct {
   productID: String!
   productname: String!
   selectedQuantity: Int!
 }

 input CreateOrderInput {
  firstname: String!
  lastname: String!
  email:String!
  products:[OrderProduct]
  totalsumwithoutdph: Float!
  totalsumwithdph: Float! 
 }

  type OrderItemResponse {
    productID: Int!
    productname: String!
    orderID: Int!
    quantity: Int!
    totalsumwithoutdph: Float
    totalsumwithdph: Float
  } 

  type OrderResponse {  
    order: [OrderItemResponse]
    mutationResponse: MutationResponse  
  }

  extend type Query {
   orders(cursor: Int!, pageNumber: Int!): Orders
  }
  extend type Mutation {
   createOrder(order: CreateOrderInput) : OrderResponse
  }
`;
export default OrderItem;
